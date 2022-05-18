import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DinamicOrdersComponent } from './dinamic-orders.component';

const routes: Routes = [{ path: "", component: DinamicOrdersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DinamicOrdersRoutingModule { }