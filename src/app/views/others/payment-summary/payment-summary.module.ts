import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { PaymentSummaryRoutingModule } from './payment-summary-routing.module';
import { PaymentSummaryComponent } from './payment-summary.component';

@NgModule({
  declarations: [PaymentSummaryComponent],
  imports: [
    SharedModule,
    PaymentSummaryRoutingModule
  ]
})

export class PaymentSummaryModule { }