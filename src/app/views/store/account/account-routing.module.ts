import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: 'profile', loadChildren: () => import('./my-profile/my-profile.module').then(m => m.MyProfileModule), canActivate: [PermissionGuard], data: { name: "profile" } },
  { path: 'vendor-profile', loadChildren: () => import('./vendor-profile/vendor-profile.module').then(m => m.VendorProfileModule), canActivate: [PermissionGuard], data: { name: "vendor_profile" } },
  { path: 'users', loadChildren: () => import('./sub-users/sub-users.module').then(m => m.SubUsersModule), canActivate: [PermissionGuard], data: { name: "sub_users" } },
  { path: 'vendors', loadChildren: () => import('./vendors/vendors.module').then(m => m.VendorsModule), canActivate: [PermissionGuard], data: { name: "vendors" } },
  { path: 'branches', loadChildren: () => import('./branches/branches.module').then(m => m.BranchesModule), canActivate: [PermissionGuard], data: { name: "branches" } },
  { path: 'wallet', loadChildren: () => import('./dp-wallet-mgmt/dp-wallet-mgmt.module').then(m => m.DpWalletMgmtModule), canActivate: [PermissionGuard], data: { name: "dp_wallet" } },
  { path: 'billing', loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule), canActivate: [PermissionGuard], data: { name: "billing" } },
  { path: 'app-store', loadChildren: () => import('./app-store/app-store.module').then(m => m.AppStoreModule), canActivate: [PermissionGuard], data: { name: "app_store" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AccountRoutingModule { }