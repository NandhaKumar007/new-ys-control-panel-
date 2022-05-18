import { NgModule } from '@angular/core';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../../shared/shared.module';

import { ModifyCouponCodeRoutingModule } from './modify-coupon-code-routing.module';
import { ModifyCouponCodeComponent } from './modify-coupon-code.component';

@NgModule({
  declarations: [ModifyCouponCodeComponent],
  imports: [
    AmazingTimePickerModule,
    SharedModule,
    ModifyCouponCodeRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class ModifyCouponCodeModule { }