import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorSettlementComponent } from './vendor-settlement.component';

const routes: Routes = [{ path: "", component: VendorSettlementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorSettlementRoutingModule { }