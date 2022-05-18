import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: 'create-order', loadChildren: () => import('./product/create-product-order/create-product-order.module').then(m => m.CreateProductOrderModule), canActivate: [PermissionGuard], data: { name: "manual_order" } },
  
  { path: 'product/:type/:customer_id', loadChildren: () => import('./product/product-orders/product-orders.module').then(m => m.ProductOrdersModule), canActivate: [PermissionGuard], data: { name: "orders" } },
  { path: 'inactive-orders', loadChildren: () => import('./product/inactive-product-orders/inactive-product-orders.module').then(m => m.InactiveProductOrdersModule), canActivate: [PermissionGuard], data: { name: "inactive_orders" } },
  { path: 'product/:type/:customer_id/:order_id', loadChildren: () => import('./product/product-order-details/product-order-details.module').then(m => m.ProductOrderDetailsModule), canActivate: [PermissionGuard], data: { name: "orders" } },

  { path: 'gift-coupon', loadChildren: () => import('./giftcard/giftcard-orders/giftcard-orders.module').then(m => m.GiftcardOrdersModule), canActivate: [PermissionGuard], data: { name: "giftcard_orders" } },
  { path: 'inactive-gift-coupons', loadChildren: () => import('./giftcard/inactive-giftcard-orders/inactive-giftcard-orders.module').then(m => m.InactiveGiftcardOrdersModule), canActivate: [PermissionGuard], data: { name: "inactive_gift_orders" } },
  { path: 'gift-coupon/:coupon_id', loadChildren: () => import('./giftcard/giftcard-order-details/giftcard-order-details.module').then(m => m.GiftcardOrderDetailsModule), canActivate: [PermissionGuard], data: { name: "giftcard_orders" } },

  { path: 'gift-coupon/:coupon_id/:order_id', loadChildren: () => import('./product/product-order-details/product-order-details.module').then(m => m.ProductOrderDetailsModule), canActivate: [PermissionGuard], data: { name: "giftcard_orders" } },

  { path: 'dinamic-offers', loadChildren: () => import('./dinamic/dinamic-orders/dinamic-orders.module').then(m => m.DinamicOrdersModule), canActivate: [PermissionGuard], data: { name: "dinamic_offer_orders" } },
  { path: 'inactive-dinamic-offers', loadChildren: () => import('./dinamic/inactive-dinamic-orders/inactive-dinamic-orders.module').then(m => m.InactiveDinamicOrdersModule), canActivate: [PermissionGuard], data: { name: "inactive_dinamic_offer_orders" } },
  { path: 'dinamic-offers/:order_id', loadChildren: () => import('./dinamic/dinamic-order-details/dinamic-order-details.module').then(m => m.DinamicOrderDetailsModule), canActivate: [PermissionGuard], data: { name: "dinamic_offer_orders" } },

  { path: 'appointments', loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule), canActivate: [PermissionGuard], data: { name: "appointments" } },

  { path: 'settlement', loadChildren: () => import('./product/vendor-settlement/vendor-settlement.module').then(m => m.VendorSettlementModule), canActivate: [PermissionGuard], data: { name: "vendor_settlement" } },
  { path: 'settlement/:order_id/:vendor_id', loadChildren: () => import('./product/vs-order-details/vs-order-details.module').then(m => m.VsOrderDetailsModule), canActivate: [PermissionGuard], data: { name: "vendor_settlement" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OrdersRoutingModule { }