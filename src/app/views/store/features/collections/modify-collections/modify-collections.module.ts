import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { ModifyCollectionsRoutingModule } from './modify-collections-routing.module';
import { ModifyCollectionsComponent } from './modify-collections.component';

@NgModule({
  declarations: [ModifyCollectionsComponent],
  imports: [
    SharedModule,
    ModifyCollectionsRoutingModule
  ]
})

export class ModifyCollectionsModule { }