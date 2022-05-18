import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { ArchiveProductsRoutingModule } from './archive-products-routing.module';
import { ArchiveProductsComponent } from './archive-products.component';

@NgModule({
  declarations: [ArchiveProductsComponent],
  imports: [
    SharedModule,
    ArchiveProductsRoutingModule
  ]
})

export class ArchiveProductsModule { }