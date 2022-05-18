import { NgModule } from '@angular/core';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { SharedModule } from '../../../../../shared/shared.module';

import { GiftcardOrderDetailsRoutingModule } from './giftcard-order-details-routing.module';
import { GiftcardOrderDetailsComponent } from './giftcard-order-details.component';

@NgModule({
  declarations: [GiftcardOrderDetailsComponent],
  imports: [
    PDFExportModule,
    SharedModule,
    GiftcardOrderDetailsRoutingModule
  ]
})

export class GiftcardOrderDetailsModule { }