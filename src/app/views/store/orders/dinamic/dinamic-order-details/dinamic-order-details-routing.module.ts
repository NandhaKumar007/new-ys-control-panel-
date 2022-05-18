import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DinamicOrderDetailsComponent } from './dinamic-order-details.component';

const routes: Routes = [{ path: "", component: DinamicOrderDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DinamicOrderDetailsRoutingModule { }