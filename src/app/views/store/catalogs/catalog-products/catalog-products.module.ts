import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { CatalogProductsRoutingModule } from './catalog-products-routing.module';
import { CatalogProductsComponent } from './catalog-products.component';

@NgModule({
  declarations: [CatalogProductsComponent],
  imports: [
    SharedModule,
    CatalogProductsRoutingModule
  ]
})

export class CatalogProductsModule { }