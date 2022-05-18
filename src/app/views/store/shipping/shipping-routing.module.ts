import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: 'shipping-methods', loadChildren: () => import('./shipping-methods/shipping-methods.module').then(m => m.ShippingMethodsModule), canActivate: [PermissionGuard], data: { name: "shipping_methods" } },
  { path: 'delivery-methods', loadChildren: () => import('./delivery-methods/delivery-methods.module').then(m => m.DeliveryMethodsModule), canActivate: [PermissionGuard], data: { name: "delivery_methods" } },
  { path: 'pincodes', loadChildren: () => import('./pincodes/pincodes.module').then(m => m.PincodesModule), canActivate: [PermissionGuard], data: { name: "pincodes" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ShippingRoutingModule { }