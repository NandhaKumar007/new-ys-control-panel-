import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppStoreComponent } from './app-store.component';

const routes: Routes = [
  { path: "", component: AppStoreComponent },
  { path:"apps", component: AppStoreComponent },
  { path:"payments", loadChildren: () => import('./app-store-payments/app-store-payments.module').then(m => m.AppStorePaymentsModule) },
  { path:":id", loadChildren: () => import('./app-details/app-details.module').then(m => m.AppDetailsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppStoreRoutingModule { }