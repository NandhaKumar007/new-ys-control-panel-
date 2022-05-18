import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorsDashboardComponent } from './vendors-dashboard.component';

const routes: Routes = [{ path: '', component: VendorsDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorsDashboardRoutingModule { }