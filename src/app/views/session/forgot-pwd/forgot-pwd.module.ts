import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { ForgotPwdRoutingModule } from './forgot-pwd-routing.module';
import { ForgotPwdComponent } from './forgot-pwd.component';

@NgModule({
  declarations: [ForgotPwdComponent],
  imports: [
    SharedModule,
    ForgotPwdRoutingModule
  ]
})

export class ForgotPwdModule { }