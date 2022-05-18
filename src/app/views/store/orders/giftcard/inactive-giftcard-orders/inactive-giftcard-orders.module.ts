import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { InactiveGiftcardOrdersRoutingModule } from './inactive-giftcard-orders-routing.module';
import { InactiveGiftcardOrdersComponent } from './inactive-giftcard-orders.component';

@NgModule({
  declarations: [InactiveGiftcardOrdersComponent],
  imports: [
    SharedModule,
    InactiveGiftcardOrdersRoutingModule
  ]
})

export class InactiveGiftcardOrdersModule { }