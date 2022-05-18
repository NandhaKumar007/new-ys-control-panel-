import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: 'currency-types', loadChildren: () => import('./currency-types/currency-types.module').then(m => m.CurrencyTypesModule), canActivate: [PermissionGuard], data: { name: "currency_types" } },
  { path: 'payment-gateway', loadChildren: () => import('./payment-methods/payment-methods.module').then(m => m.PaymentMethodsModule), canActivate: [PermissionGuard], data: { name: "payment_gateway" } },
  { path: 'contact-page', loadChildren: () => import('./contact-page/contact-page.module').then(m => m.ContactPageModule), canActivate: [PermissionGuard], data: { name: "contact_page" } },
  { path: 'store-locator', loadChildren: () => import('./store-locator/store-locator.module').then(m => m.StoreLocatorModule), canActivate: [PermissionGuard], data: { name: "store_locator" } },
  { path: 'policies/:type', loadChildren: () => import('./policies/policies.module').then(m => m.PoliciesModule), canActivate: [PermissionGuard], data: { name: "policies" } },
  { path: 'extra-pages', loadChildren: () => import('./extra-pages/extra-pages.module').then(m => m.ExtraPagesModule), canActivate: [PermissionGuard], data: { name: "extra_pages" } },
  { path: 'footer-content', loadChildren: () => import('./footer-content/footer-content.module').then(m => m.FooterContentModule), canActivate: [PermissionGuard], data: { name: "footer_content" } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
