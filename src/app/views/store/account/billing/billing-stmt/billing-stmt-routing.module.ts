import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingStmtComponent } from './billing-stmt.component';

const routes: Routes = [{ path: "", component: BillingStmtComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BillingStmtRoutingModule { }