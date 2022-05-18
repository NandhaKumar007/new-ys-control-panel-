import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/common.service';
import { StoreApiService } from '../../../../services/store-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})

export class MyProfileComponent implements OnInit {

  storeData: any = {};
  addressInfo: any; pwdForm: any = {};
  state_list: any = [];
  configData: any = environment.config_data;
  
  constructor(config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService, private api: StoreApiService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.addressInfo =[];
    if(this.commonService.store_details?.company_details) {
      if(this.commonService.store_details?.company_details?.city) this.addressInfo.push(this.commonService.store_details.company_details.city);
      if(this.commonService.store_details?.company_details?.state) this.addressInfo.push(this.commonService.store_details.company_details.state);
      if(this.commonService.store_details?.company_details?.pincode) this.addressInfo.push(this.commonService.store_details.company_details.pincode);
      this.addressInfo.push(this.commonService.store_details.country);
    }
  }

  onEdit(modalName) {
    this.api.STORE_DETAILS().subscribe(result => {
      if(result.status) {
        this.storeData = result.data;
        this.storeData.category = this.commonService.deploy_details.category;
        this.onCountryChange(this.storeData.country);
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }

  onUpdate(modalName) {
    let formData: any = { name: this.storeData.name, gst_no: this.storeData.gst_no, company_details: this.storeData.company_details };
    if(this.commonService.deploy_details.category == this.storeData.category) {
      this.onUpdateCont(formData);
    }
    else {
      if(this.storeData.change_category) {
        formData.category = this.storeData.category;
        formData.change_category = true;
        this.onUpdateCont(formData);
      }
      else this.modalService.open(modalName, { size: 'md', centered: true});
    }
  }
  onUpdateCont(formData) {
    this.storeData.submit = true;
    this.api.STORE_UPDATE(formData).subscribe(result => {
      this.storeData.submit = false;
      if(result.status) {
        this.commonService.store_details.name = result.data.name;
        this.commonService.store_details.gst_no = result.data.gst_no;
        this.commonService.store_details.company_details = result.data.company_details;
        this.commonService.updateLocalData('store_details', this.commonService.store_details);
        if(result.deploy_details) {
          this.commonService.deploy_details = result.deploy_details;
          delete this.commonService.deploy_details.deploy_stages;
          this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
        }
        this.ngOnInit();
        document.getElementById('closeModal').click();
      }
      else {
				this.storeData.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onChangePwd() {
    this.pwdForm.submit = true;
    this.api.CHANGE_PWD(this.pwdForm).subscribe(result => {
      this.pwdForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.commonService.signOut('/session/signin');
      }
      else {
				this.pwdForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onCountryChange(x) {
    this.state_list = [];
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      this.state_list = this.commonService.country_list[index].states;
      if(!this.storeData.company_details.dial_code)
        this.storeData.company_details.dial_code = this.commonService.country_list[index].dial_code;
    }
  }

}