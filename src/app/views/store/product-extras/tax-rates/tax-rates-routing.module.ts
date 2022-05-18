import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxRatesComponent } from './tax-rates.component';

const routes: Routes = [{ path: '', component: TaxRatesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TaxRatesRoutingModule { }