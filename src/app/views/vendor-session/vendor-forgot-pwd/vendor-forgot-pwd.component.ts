import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-vendor-forgot-pwd',
  templateUrl: './vendor-forgot-pwd.component.html',
  styleUrls: ['./vendor-forgot-pwd.component.scss'],
  animations: [SharedAnimations]
})

export class VendorForgotPwdComponent implements OnInit {

  forgotForm: any;
  loading: boolean; loadingText: string;
  successMsg: string; errorMsg: string;

  constructor(public commonService: CommonService, private api: ApiService) { }

  ngOnInit() {
    this.forgotForm = {};
    this.loading = false; this.loadingText = "";
    this.successMsg = null; this.errorMsg = null;
  }

  submit() {
    this.loading = true; this.loadingText = 'Sending mail...';
    this.api.VENDOR_FORGOT_REQUEST({ store_id: this.commonService.vendor_login_info.id, email: this.forgotForm.email }).subscribe(result => {
      this.loading = false; this.loadingText = "";
      if(result.status) {
        this.successMsg = result.message;
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}