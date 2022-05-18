import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: '', component: CustomersComponent },
  { path: ':id', loadChildren: () => import('./customer-details/customer-details.module').then(m => m.CustomerDetailsModule), canActivate: [PermissionGuard], data: { name: "customers" } },
  { path: ':id/:model_id', loadChildren: () => import('./model-history/model-history.module').then(m => m.ModelHistoryModule), canActivate: [PermissionGuard], data: { name: "custom_model_history" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CustomersRoutingModule { }