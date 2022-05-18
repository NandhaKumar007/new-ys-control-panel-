import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FootNoteComponent } from './foot-note.component';

const routes: Routes = [{ path: '', component: FootNoteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FootNoteRoutingModule { }