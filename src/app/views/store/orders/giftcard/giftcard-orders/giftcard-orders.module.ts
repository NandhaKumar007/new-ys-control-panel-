import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../../shared/shared.module';

import { GiftcardOrdersRoutingModule } from './giftcard-orders-routing.module';
import { GiftcardOrdersComponent } from './giftcard-orders.component';

@NgModule({
  declarations: [GiftcardOrdersComponent],
  imports: [
    SharedModule,
    GiftcardOrdersRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class GiftcardOrdersModule { }