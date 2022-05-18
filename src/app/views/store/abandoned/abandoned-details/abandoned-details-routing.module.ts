import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbandonedDetailsComponent } from './abandoned-details.component';

const routes: Routes = [{ path: '', component: AbandonedDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AbandonedDetailsRoutingModule { }