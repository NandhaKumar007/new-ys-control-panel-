import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { PaymentMethodsRoutingModule } from './payment-methods-routing.module';
import { PaymentMethodsComponent } from './payment-methods.component';

@NgModule({
  declarations: [PaymentMethodsComponent],
  imports: [
    SharedModule,
    PaymentMethodsRoutingModule
  ]
})

export class PaymentMethodsModule { }