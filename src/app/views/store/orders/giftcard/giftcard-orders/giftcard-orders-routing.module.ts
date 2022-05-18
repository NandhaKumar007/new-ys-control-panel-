import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GiftcardOrdersComponent } from './giftcard-orders.component';

const routes: Routes = [{ path: '', component: GiftcardOrdersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GiftcardOrdersRoutingModule { }