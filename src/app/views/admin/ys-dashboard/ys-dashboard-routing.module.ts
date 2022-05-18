import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YsDashboardComponent } from './ys-dashboard.component';

const routes: Routes = [{ path: '', component: YsDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsDashboardRoutingModule { }