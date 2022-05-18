import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GiftcardComponent } from './giftcard.component';

const routes: Routes = [{ path: '', component: GiftcardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GiftcardRoutingModule { }