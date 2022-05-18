import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ProductLayoutRoutingModule } from './product-layout-routing.module';
import { ProductLayoutComponent } from './product-layout.component';

@NgModule({
  declarations: [ProductLayoutComponent],
  imports: [
    SharedModule,
    ProductLayoutRoutingModule
  ]
})

export class ProductLayoutModule { }