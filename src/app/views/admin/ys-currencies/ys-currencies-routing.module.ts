import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YsCurrenciesComponent } from './ys-currencies.component';

const routes: Routes = [{ path: '', component: YsCurrenciesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsCurrenciesRoutingModule { }