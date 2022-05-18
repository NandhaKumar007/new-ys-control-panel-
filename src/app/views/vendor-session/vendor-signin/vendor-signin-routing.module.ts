import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorSigninComponent } from './vendor-signin.component';

const routes: Routes = [{ path: '', component: VendorSigninComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorSigninRoutingModule { }