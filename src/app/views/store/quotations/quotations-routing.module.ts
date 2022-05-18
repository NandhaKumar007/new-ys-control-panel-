import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotationsComponent } from './quotations.component';

const routes: Routes = [
  { path: '', component: QuotationsComponent },
  { path: ':quot_id', loadChildren: () => import('./quotation-details/quotation-details.module').then(m => m.QuotationDetailsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class QuotationsRoutingModule { }