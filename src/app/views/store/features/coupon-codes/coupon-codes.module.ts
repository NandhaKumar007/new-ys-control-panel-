import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { CouponCodesRoutingModule } from './coupon-codes-routing.module';
import { CouponCodesComponent } from './coupon-codes.component';

@NgModule({
  declarations: [CouponCodesComponent],
  imports: [
    SharedModule,
    CouponCodesRoutingModule
  ]
})

export class CouponCodesModule { }