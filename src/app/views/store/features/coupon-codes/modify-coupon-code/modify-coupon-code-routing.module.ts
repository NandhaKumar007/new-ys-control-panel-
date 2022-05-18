import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyCouponCodeComponent } from './modify-coupon-code.component';

const routes: Routes = [{ path: '', component: ModifyCouponCodeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModifyCouponCodeRoutingModule { }