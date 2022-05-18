import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { CreateProductOrderRoutingModule } from './create-product-order-routing.module';
import { CreateProductOrderComponent } from './create-product-order.component';

@NgModule({
  declarations: [CreateProductOrderComponent],
  imports: [
    SharedModule,
    CreateProductOrderRoutingModule
  ]
})

export class CreateProductOrderModule { }