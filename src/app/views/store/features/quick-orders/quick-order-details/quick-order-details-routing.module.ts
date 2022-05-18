import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuickOrderDetailsComponent } from './quick-order-details.component';

const routes: Routes = [{ path: "", component: QuickOrderDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class QuickOrderDetailsRoutingModule { }