import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.scss'],
  animations: [SharedAnimations]
})

export class ForgotPwdComponent implements OnInit {

  forgotForm: any;
  loading: boolean; loadingText: string;
  successMsg: string; errorMsg: string;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.forgotForm = {};
    this.loading = false; this.loadingText = "";
    this.successMsg = null; this.errorMsg = null;
  }

  submit() {
    this.loading = true; this.loadingText = 'Sending mail...';
    this.api.FORGOT_REQUEST({ email: this.forgotForm.email }).subscribe(result => {
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