import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './setting.component';

const routes: Routes = [
  { path: '', component: SettingComponent },
  { path: 'logo-management', loadChildren: () => import('./logo-management/logo-management.module').then(m => m.LogoManagementModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SettingRoutingModule { }