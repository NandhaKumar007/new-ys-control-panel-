import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModelHistoryComponent } from './model-history.component';

const routes: Routes = [{ path: "", component: ModelHistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModelHistoryRoutingModule { }