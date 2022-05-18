import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSeoComponent } from './product-seo.component';

const routes: Routes = [{ path: '', component: ProductSeoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductSeoRoutingModule { }