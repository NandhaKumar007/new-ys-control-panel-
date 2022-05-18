import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { VendorSettlementRoutingModule } from './vendor-settlement-routing.module';
import { VendorSettlementComponent } from './vendor-settlement.component';

@NgModule({
  declarations: [VendorSettlementComponent],
  imports: [
    SharedModule,
    VendorSettlementRoutingModule
  ]
})

export class VendorSettlementModule { }