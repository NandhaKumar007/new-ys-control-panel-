import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdManagementComponent } from './ad-management.component';

const routes: Routes = [{ path: "", component: AdManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdManagementRoutingModule { }