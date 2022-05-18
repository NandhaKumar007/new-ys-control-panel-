import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateProductOrderComponent } from './create-product-order.component';

const routes: Routes = [{ path: '', component: CreateProductOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CreateProductOrderRoutingModule { }