import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { VendorForgotPwdRoutingModule } from './vendor-forgot-pwd-routing.module';
import { VendorForgotPwdComponent } from './vendor-forgot-pwd.component';

@NgModule({
  declarations: [VendorForgotPwdComponent],
  imports: [
    SharedModule,
    VendorForgotPwdRoutingModule
  ]
})

export class VendorForgotPwdModule { }