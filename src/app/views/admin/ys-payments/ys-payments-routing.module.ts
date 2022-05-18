import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YsPaymentsComponent } from './ys-payments.component';

const routes: Routes = [{ path: '', component: YsPaymentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsPaymentsRoutingModule { }