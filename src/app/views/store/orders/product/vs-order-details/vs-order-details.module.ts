import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { VsOrderDetailsRoutingModule } from './vs-order-details-routing.module';
import { VsOrderDetailsComponent } from './vs-order-details.component';

@NgModule({
  declarations: [VsOrderDetailsComponent],
  imports: [
    SharedModule,
    VsOrderDetailsRoutingModule
  ]
})

export class VsOrderDetailsModule { }