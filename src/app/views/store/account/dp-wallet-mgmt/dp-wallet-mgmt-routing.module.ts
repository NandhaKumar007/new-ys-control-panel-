import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DpWalletMgmtComponent } from './dp-wallet-mgmt.component';

const routes: Routes = [{ path: '', component: DpWalletMgmtComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DpWalletMgmtRoutingModule { }