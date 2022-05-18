import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home-layout/home-layout.module').then(m => m.HomeLayoutModule), canActivate: [PermissionGuard], data: { name: "home_layout" } },
  { path: 'catalog', loadChildren: () => import('./catalog-layout/catalog-layout.module').then(m => m.CatalogLayoutModule), canActivate: [PermissionGuard], data: { name: "catalog_layout" } },
  { path: 'product', loadChildren: () => import('./product-layout/product-layout.module').then(m => m.ProductLayoutModule), canActivate: [PermissionGuard], data: { name: "product_layout" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LayoutsRoutingModule { }