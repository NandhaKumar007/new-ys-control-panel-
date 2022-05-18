import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: 'blogs', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule), canActivate: [PermissionGuard], data: { name: "blogs" } },
  { path: 'collections', loadChildren: () => import('./collections/collections.module').then(m => m.CollectionsModule), canActivate: [PermissionGuard], data: { name: "collections" } },
  { path: 'coupon-codes', loadChildren: () => import('./coupon-codes/coupon-codes.module').then(m => m.CouponCodesModule), canActivate: [PermissionGuard], data: { name: "offers" } },
  { path: 'discounts-page', loadChildren: () => import('./discounts-page/discounts-page.module').then(m => m.DiscountsPageModule), canActivate: [PermissionGuard], data: { name: "discounts_page" } },
  { path: 'giftcard', loadChildren: () => import('./giftcard/giftcard.module').then(m => m.GiftcardModule), canActivate: [PermissionGuard], data: { name: "giftcard" } },
  { path: 'menus', loadChildren: () => import('./menus/menus.module').then(m => m.MenusModule), canActivate: [PermissionGuard], data: { name: "menus" } },
  { path: 'appointment-categories', loadChildren: () => import('./appointment-categories/appointment-categories.module').then(m => m.AppointmentCategoriesModule), canActivate: [PermissionGuard], data: { name: "appointment_services" } },
  { path: 'product-reviews', loadChildren: () => import('./product-reviews/product-reviews.module').then(m => m.ProductReviewsModule), canActivate: [PermissionGuard], data: { name: "product_reviews" } },
  { path: 'selected-product-reviews', loadChildren: () => import('./product-reviews/product-reviews.module').then(m => m.ProductReviewsModule), canActivate: [PermissionGuard], data: { name: "product_reviews" } },
  { path: 'dinamic-offers', loadChildren: () => import('./dinamic-offers/dinamic-offers.module').then(m => m.DinamicOffersModule), canActivate: [PermissionGuard], data: { name: "dinamic_offers" } },
  { path: 'quick-orders', loadChildren: () => import('./quick-orders/quick-orders.module').then(m => m.QuickOrdersModule), canActivate: [PermissionGuard], data: { name: "quick_order" } },
  { path: 'ad-management', loadChildren: () => import('./ad-management/ad-management.module').then(m => m.AdManagementModule), canActivate: [PermissionGuard], data: { name: "ad_management" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FeaturesRoutingModule { }