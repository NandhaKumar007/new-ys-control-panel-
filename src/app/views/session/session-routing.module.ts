import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'signup', loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule) },
  { path: 'signup/pro', loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule) },
  { path: 'signup/pro/:service', loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule) },
  { path: 'signin', loadChildren: () => import('./signin/signin.module').then(m => m.SigninModule) },
  { path: 'signin/master', loadChildren: () => import('./signin/signin.module').then(m => m.SigninModule) },
  { path: 'forgot-password', loadChildren: () => import('./forgot-pwd/forgot-pwd.module').then(m => m.ForgotPwdModule) },
  { path: 'password-recovery/:token', loadChildren: () => import('./pwd-recovery/pwd-recovery.module').then(m => m.PwdRecoveryModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SessionRoutingModule { }