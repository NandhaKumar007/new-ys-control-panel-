import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogsComponent } from './catalogs.component';

const routes: Routes = [
  { path: '', component: CatalogsComponent },
  { path: ':id', loadChildren: () => import('./catalog-products/catalog-products.module').then(m => m.CatalogProductsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogsRoutingModule { }