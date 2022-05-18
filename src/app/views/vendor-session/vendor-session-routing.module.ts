import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'signin/:store', loadChildren: () => import('./vendor-signin/vendor-signin.module').then(m => m.VendorSigninModule) },
  { path: 'forgot-password/:store_id', loadChildren: () => import('./vendor-forgot-pwd/vendor-forgot-pwd.module').then(m => m.VendorForgotPwdModule) },
  { path: 'password-recovery/:token/:store_id', loadChildren: () => import('./vendor-pwd-recovery/vendor-pwd-recovery.module').then(m => m.VendorPwdRecoveryModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorSessionRoutingModule { }