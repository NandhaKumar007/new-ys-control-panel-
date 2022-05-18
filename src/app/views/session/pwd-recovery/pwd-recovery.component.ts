import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-pwd-recovery',
  templateUrl: './pwd-recovery.component.html',
  styleUrls: ['./pwd-recovery.component.scss'],
  animations: [SharedAnimations]
})

export class PwdRecoveryComponent implements OnInit {

  pwdForm: any; params: any; pageLoader: boolean;
  loading: boolean; loadingText: string;
  recoveryStatus: boolean; responseData: string;
  constructor(private activeRoute: ActivatedRoute, private router: Router, private api: ApiService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true;
      this.params = params; this.pwdForm = {};
      this.loading = false; this.loadingText = null;
      if(this.params.token && this.params.token!='') {
        this.api.VALIDATE_FORGOT_REQUEST({ temp_token: this.params.token }).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          this.recoveryStatus = result.status;
          this.responseData = result.message;
        });
      }
      else {
        this.recoveryStatus = false;
        this.responseData = "Invalid Recovery Link";
      }
    });
  }

  onPwdUpdate() {
    if(this.pwdForm.new_pwd == this.pwdForm.confirm_pwd) {
      if(this.params.token && this.params.token!='') {
        this.loading = true; this.loadingText = "Reset Password";
        this.api.UPDATE_PWD({ temp_token: this.params.token, new_pwd: this.pwdForm.new_pwd }).subscribe(result => {
          this.loading = false;
          this.recoveryStatus = result.status;
          this.responseData = result.message;
          if(result.status) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate(['/session/signin']);
          }
          else console.log("response", result);
        });
      }
      else {
        this.recoveryStatus = false;
        this.responseData = "Invalid Recovery Link";
      }
    }
  }

}