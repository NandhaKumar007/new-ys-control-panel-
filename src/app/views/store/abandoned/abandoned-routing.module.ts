import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'customer', loadChildren: () => import('./abandoned-customers/abandoned-customers.module').then(m => m.AbandonedCustomersModule) },
  { path: 'guest-user', loadChildren: () => import('./abandoned-guest-users/abandoned-guest-users.module').then(m => m.AbandonedGuestUsersModule) },
  { path: 'customer/:customer_id', loadChildren: () => import('./abandoned-details/abandoned-details.module').then(m => m.AbandonedDetailsModule) },
  { path: 'guest-user/:customer_id', loadChildren: () => import('./abandoned-details/abandoned-details.module').then(m => m.AbandonedDetailsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AbandonedRoutingModule { }