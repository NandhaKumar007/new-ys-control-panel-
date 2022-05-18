import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InactiveGiftcardOrdersComponent } from './inactive-giftcard-orders.component';

const routes: Routes = [{ path: '', component: InactiveGiftcardOrdersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InactiveGiftcardOrdersRoutingModule { }