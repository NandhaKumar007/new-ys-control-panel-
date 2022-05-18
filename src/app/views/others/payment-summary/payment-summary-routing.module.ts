import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentSummaryComponent } from './payment-summary.component';

const routes: Routes = [{ path: "", component: PaymentSummaryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PaymentSummaryRoutingModule { }