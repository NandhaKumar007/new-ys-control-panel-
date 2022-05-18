import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoManagementComponent } from './logo-management.component';

const routes: Routes = [{ path: '', component: LogoManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LogoManagementRoutingModule { }