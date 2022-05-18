import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product.component';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: '', component: ProductComponent, canActivate: [PermissionGuard], data: { name: "products" } },
  { path: 'add/:rank', loadChildren: () => import('./add-product/add-product.module').then(m => m.AddProductModule), canActivate: [PermissionGuard], data: { name: "product_add" } },
  { path: 'modify/:product_id/:rank/:step', loadChildren: () => import('./modify-product/modify-product.module').then(m => m.ModifyProductModule), canActivate: [PermissionGuard], data: { name: "product_edit" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductRoutingModule { }