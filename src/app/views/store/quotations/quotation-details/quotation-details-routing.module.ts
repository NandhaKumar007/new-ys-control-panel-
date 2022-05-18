import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotationDetailsComponent } from './quotation-details.component';

const routes: Routes = [{ path: '', component: QuotationDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class QuotationDetailsRoutingModule { }