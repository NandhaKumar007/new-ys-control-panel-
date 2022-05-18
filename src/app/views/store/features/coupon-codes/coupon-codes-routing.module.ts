import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponCodesComponent } from './coupon-codes.component';

const routes: Routes = [
  { path: '', component: CouponCodesComponent },
  { path: 'new', loadChildren: () => import('./modify-coupon-code/modify-coupon-code.module').then(m => m.ModifyCouponCodeModule) },
  { path: 'modify/:offer_id', loadChildren: () => import('./modify-coupon-code/modify-coupon-code.module').then(m => m.ModifyCouponCodeModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CouponCodesRoutingModule { }