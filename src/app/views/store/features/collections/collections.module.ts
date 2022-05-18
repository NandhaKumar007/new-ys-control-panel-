import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { CollectionsRoutingModule } from './collections-routing.module';
import { CollectionsComponent } from './collections.component';

@NgModule({
  declarations: [CollectionsComponent],
  imports: [
    SharedModule,
    CollectionsRoutingModule
  ]
})

export class CollectionsModule { }