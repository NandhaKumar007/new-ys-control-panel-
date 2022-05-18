import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ProductTaxonomyRoutingModule } from './product-taxonomy-routing.module';
import { ProductTaxonomyComponent } from './product-taxonomy.component';

@NgModule({
  declarations: [ProductTaxonomyComponent],
  imports: [
    SharedModule,
    ProductTaxonomyRoutingModule
  ]
})

export class ProductTaxonomyModule { }