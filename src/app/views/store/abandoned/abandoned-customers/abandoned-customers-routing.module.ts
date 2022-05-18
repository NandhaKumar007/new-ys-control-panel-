import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbandonedCustomersComponent } from './abandoned-customers.component';

const routes: Routes = [{ path: "", component: AbandonedCustomersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AbandonedCustomersRoutingModule { }