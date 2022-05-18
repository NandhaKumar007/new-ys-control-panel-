import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductOrdersComponent } from './product-orders.component';

const routes: Routes = [{ path: '', component: ProductOrdersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductOrdersRoutingModule { }