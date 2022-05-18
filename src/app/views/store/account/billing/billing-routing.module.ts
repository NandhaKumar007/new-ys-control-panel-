import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from './billing.component';

const routes: Routes = [
  { path: '', component: BillingComponent },
  { path: 'statement', loadChildren: () => import('./billing-stmt/billing-stmt.module').then(m => m.BillingStmtModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BillingRoutingModule { }