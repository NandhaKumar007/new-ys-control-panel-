import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtraPagesEventComponent } from './extra-pages-event.component';

const routes: Routes = [{ path: "", component: ExtraPagesEventComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ExtraPagesEventRoutingModule { }