import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { CustomerDetailsRoutingModule } from './customer-details-routing.module';
import { CustomerDetailsComponent } from './customer-details.component';

@NgModule({
  declarations: [CustomerDetailsComponent],
  imports: [
    SharedModule,
    CustomerDetailsRoutingModule
  ]
})

export class CustomerDetailsModule { }