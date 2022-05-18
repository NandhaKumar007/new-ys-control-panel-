import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppDetailsComponent } from './app-details.component';

const routes: Routes = [{ path: "", component: AppDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppDetailsRoutingModule { }