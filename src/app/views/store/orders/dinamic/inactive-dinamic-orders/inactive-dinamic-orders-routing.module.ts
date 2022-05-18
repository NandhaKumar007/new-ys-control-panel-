import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InactiveDinamicOrdersComponent } from './inactive-dinamic-orders.component';

const routes: Routes = [{ path: "", component: InactiveDinamicOrdersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InactiveDinamicOrdersRoutingModule { }