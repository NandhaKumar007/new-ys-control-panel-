import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { AbandonedCustomersRoutingModule } from './abandoned-customers-routing.module';
import { AbandonedCustomersComponent } from './abandoned-customers.component';

@NgModule({
  declarations: [AbandonedCustomersComponent],
  imports: [
    SharedModule,
    AbandonedCustomersRoutingModule
  ]
})

export class AbandonedCustomersModule { }