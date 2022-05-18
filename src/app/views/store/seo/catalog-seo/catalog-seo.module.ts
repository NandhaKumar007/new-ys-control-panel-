import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../shared/shared.module';

import { CatalogSeoRoutingModule } from './catalog-seo-routing.module';
import { CatalogSeoComponent } from './catalog-seo.component';

@NgModule({
  declarations: [CatalogSeoComponent],
  imports: [
    SharedModule,
    TagInputModule,
    CatalogSeoRoutingModule
  ]
})

export class CatalogSeoModule { }