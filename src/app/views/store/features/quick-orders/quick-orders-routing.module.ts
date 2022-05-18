import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuickOrdersComponent } from './quick-orders.component';

const routes: Routes = [
  { path:"", component: QuickOrdersComponent },
  { path:"create/:count", loadChildren: () => import('./quick-order-details/quick-order-details.module').then(m => m.QuickOrderDetailsModule) },
  { path:":id", loadChildren: () => import('./quick-order-details/quick-order-details.module').then(m => m.QuickOrderDetailsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class QuickOrdersRoutingModule { }