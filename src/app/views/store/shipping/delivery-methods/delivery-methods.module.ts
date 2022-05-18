import { NgModule } from '@angular/core';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { SharedModule } from '../../../../shared/shared.module';

import { DeliveryMethodsRoutingModule } from './delivery-methods-routing.module';
import { DeliveryMethodsComponent } from './delivery-methods.component';

@NgModule({
  declarations: [DeliveryMethodsComponent],
  imports: [
    AmazingTimePickerModule,
    SharedModule,
    DeliveryMethodsRoutingModule
  ]
})

export class DeliveryMethodsModule { }