import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrencyTypesComponent } from './currency-types.component';

const routes: Routes = [{ path: '', component: CurrencyTypesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CurrencyTypesRoutingModule { }