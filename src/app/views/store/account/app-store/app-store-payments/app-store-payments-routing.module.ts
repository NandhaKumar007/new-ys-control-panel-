import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppStorePaymentsComponent } from './app-store-payments.component';

const routes: Routes = [{ path: "", component: AppStorePaymentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppStorePaymentsRoutingModule { }