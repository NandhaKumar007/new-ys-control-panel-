import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../account.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.scss']
})

export class VendorProfileComponent implements OnInit {

  pageLoader: boolean;
  imgBaseUrl = environment.img_baseurl;
  pwdForm: any = {}; vendorDetails: any = {};
  imgForm: any = {};
  
  constructor(
    config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService, private accountApi: AccountService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true;
    this.accountApi.VENDOR_LIST().subscribe((result) => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) this.vendorDetails = result.data;
      else console.log("response", result);
    });
  }

  onUpdateBanner() {
    this.imgForm.submit = true;
    this.accountApi.UPDATE_VENDOR(this.imgForm).subscribe(result => {
      this.imgForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.vendorDetails = result.data;
      }
      else {
        this.imgForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onChangePwd() {
    this.pwdForm.submit = true;
    this.accountApi.CHANGE_VENDOR_PWD(this.pwdForm).subscribe(result => {
      this.pwdForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.commonService.signOut('/session/signin/vendor');
      }
      else {
				this.pwdForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.imgForm.image = (<FileReader>event.target).result;
        this.imgForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
