import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../features-api.service';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-giftcard',
  templateUrl: './giftcard.component.html',
  styleUrls: ['./giftcard.component.scss'],
  animations: [SharedAnimations]
})

export class GiftcardComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; search_bar: any;
  gcForm: any; deleteForm: any; settingForm: any;
  pageLoader: boolean;
  imgBaseUrl = environment.img_baseurl;
  
  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: FeaturesApiService,
    public commonService: CommonService, private storeApi: StoreApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.GIFTCARD_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // ADD
	onSubmit(modalName) {
    this.gcForm.submit = true;
    if(this.gcForm.form_type=='add') {
      this.gcForm.page_url = this.commonService.urlFormat(this.gcForm.name);
      this.api.ADD_GIFTCARD(this.gcForm).subscribe(result => {
        this.gcForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
        }
        else {
          this.gcForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_GIFTCARD(this.gcForm).subscribe(result => {
        this.gcForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
        }
        else {
          this.gcForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // EDIT
  onEdit(x, modalName) {
    this.gcForm = { form_type: 'edit' };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.gcForm[key] = x[key];
    }
    this.gcForm.prev_rank = this.gcForm.rank;
    this.modalService.open(modalName);
  }

  // DELETE
  onDelete() {
    this.api.DELETE_GIFTCARD(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeDeleteModal').click();
        this.list = result.list;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }
  
  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.gcForm.image = (<FileReader>event.target).result;
        this.gcForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  openSettingModal(modalName) {
    this.settingForm = { price_list: [] };
    this.storeApi.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        if(result.data.giftcard_config) this.settingForm = result.data.giftcard_config;
        // search keywords
        this.settingForm.form_price_list = [];
        if(this.settingForm.price_list.length) {
          this.settingForm.price_list.forEach(obj => {
            this.settingForm.form_price_list.push({display: obj, value: obj});
          });
        }
        this.modalService.open(modalName);
      }
      else console.log("response", result);
    });
  }

  onUpdateSetting() {
    this.settingForm.price_list = [];
    if(this.settingForm.form_price_list) {
      this.settingForm.form_price_list.forEach(obj => {
        if(parseFloat(obj.value)) this.settingForm.price_list.push(parseFloat(obj.value));
      });
    }
    this.storeApi.UPDATE_STORE_PROPERTY_DETAILS({ giftcard_config: this.settingForm }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.settingForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}