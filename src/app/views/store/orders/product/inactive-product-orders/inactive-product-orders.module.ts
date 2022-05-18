import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../../shared/shared.module';

import { InactiveProductOrdersRoutingModule } from './inactive-product-orders-routing.module';
import { InactiveProductOrdersComponent } from './inactive-product-orders.component';

@NgModule({
  declarations: [InactiveProductOrdersComponent],
  imports: [
    SharedModule,
    InactiveProductOrdersRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class InactiveProductOrdersModule { }