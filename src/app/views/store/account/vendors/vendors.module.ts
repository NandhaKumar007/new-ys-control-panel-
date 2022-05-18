import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { VendorsRoutingModule } from './vendors-routing.module';
import { VendorsComponent } from './vendors.component';

@NgModule({
  declarations: [VendorsComponent],
  imports: [
    SharedModule,
    VendorsRoutingModule
  ]
})

export class VendorsModule { }