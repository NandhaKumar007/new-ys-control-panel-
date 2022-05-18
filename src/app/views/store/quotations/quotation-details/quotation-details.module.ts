import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { QuotationDetailsRoutingModule } from './quotation-details-routing.module';
import { QuotationDetailsComponent } from './quotation-details.component';

@NgModule({
  declarations: [QuotationDetailsComponent],
  imports: [
    SharedModule,
    QuotationDetailsRoutingModule
  ]
})

export class QuotationDetailsModule { }