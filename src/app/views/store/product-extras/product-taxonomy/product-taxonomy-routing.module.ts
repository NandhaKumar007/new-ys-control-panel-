import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductTaxonomyComponent } from './product-taxonomy.component';

const routes: Routes = [{ path: "", component: ProductTaxonomyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductTaxonomyRoutingModule { }