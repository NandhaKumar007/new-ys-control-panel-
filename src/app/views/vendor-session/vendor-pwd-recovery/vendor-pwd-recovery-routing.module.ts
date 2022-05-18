import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorPwdRecoveryComponent } from './vendor-pwd-recovery.component';

const routes: Routes = [{ path: '', component: VendorPwdRecoveryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorPwdRecoveryRoutingModule { }