import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiscountsPageComponent } from './discounts-page.component';

const routes: Routes = [{ path: '', component: DiscountsPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DiscountsPageRoutingModule { }