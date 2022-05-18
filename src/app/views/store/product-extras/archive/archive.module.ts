import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ArchiveRoutingModule } from './archive-routing.module';
import { ArchiveComponent } from './archive.component';

@NgModule({
  declarations: [ArchiveComponent],
  imports: [
    SharedModule,
    ArchiveRoutingModule
  ]
})

export class ArchiveModule { }