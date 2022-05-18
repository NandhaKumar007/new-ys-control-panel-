import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogProductsComponent } from './catalog-products.component';

const routes: Routes = [{ path: '', component: CatalogProductsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogProductsRoutingModule { }