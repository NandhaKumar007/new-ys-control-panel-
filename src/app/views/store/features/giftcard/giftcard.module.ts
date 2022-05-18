import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../shared/shared.module';

import { GiftcardRoutingModule } from './giftcard-routing.module';
import { GiftcardComponent } from './giftcard.component';

@NgModule({
  declarations: [GiftcardComponent],
  imports: [
    TagInputModule,
    SharedModule,
    GiftcardRoutingModule
  ]
})

export class GiftcardModule { }