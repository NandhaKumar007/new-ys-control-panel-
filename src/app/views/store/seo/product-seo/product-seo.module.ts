import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../shared/shared.module';

import { ProductSeoRoutingModule } from './product-seo-routing.module';
import { ProductSeoComponent } from './product-seo.component';

@NgModule({
  declarations: [ProductSeoComponent],
  imports: [
    SharedModule,
    TagInputModule,
    ProductSeoRoutingModule
  ]
})

export class ProductSeoModule { }