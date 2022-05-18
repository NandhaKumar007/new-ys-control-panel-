import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { TagRoutingModule } from './tag-routing.module';
import { TagComponent } from './tag.component';

@NgModule({
  declarations: [TagComponent],
  imports: [
    SharedModule,
    TagRoutingModule
  ]
})

export class TagModule { }