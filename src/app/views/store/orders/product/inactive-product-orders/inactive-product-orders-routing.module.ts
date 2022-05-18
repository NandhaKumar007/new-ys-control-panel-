import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InactiveProductOrdersComponent } from './inactive-product-orders.component';

const routes: Routes = [{ path: '', component: InactiveProductOrdersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InactiveProductOrdersRoutingModule { }