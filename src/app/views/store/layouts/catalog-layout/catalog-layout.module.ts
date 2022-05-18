import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { CatalogLayoutRoutingModule } from './catalog-layout-routing.module';
import { CatalogLayoutComponent } from './catalog-layout.component';

@NgModule({
  declarations: [CatalogLayoutComponent],
  imports: [
    SharedModule,
    CatalogLayoutRoutingModule
  ]
})

export class CatalogLayoutModule { }