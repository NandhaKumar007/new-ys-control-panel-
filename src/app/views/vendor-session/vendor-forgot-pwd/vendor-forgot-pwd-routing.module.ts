import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorForgotPwdComponent } from './vendor-forgot-pwd.component';

const routes: Routes = [{ path: '', component: VendorForgotPwdComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorForgotPwdRoutingModule { }