import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { FootNoteRoutingModule } from './foot-note-routing.module';
import { FootNoteComponent } from './foot-note.component';

@NgModule({
  declarations: [FootNoteComponent],
  imports: [
    SharedModule,
    FootNoteRoutingModule
  ]
})

export class FootNoteModule { }