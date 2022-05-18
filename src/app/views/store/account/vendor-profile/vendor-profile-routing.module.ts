import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorProfileComponent } from './vendor-profile.component';

const routes: Routes = [{ path: "", component: VendorProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorProfileRoutingModule { }