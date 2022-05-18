import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SizeChartComponent } from './size-chart.component';

const routes: Routes = [
  { path: '', component: SizeChartComponent },
  { path: 'create', loadChildren: () => import('./modify-size-chart/modify-size-chart.module').then(m => m.ModifySizeChartModule) },
  { path: 'modify/:chart_id', loadChildren: () => import('./modify-size-chart/modify-size-chart.module').then(m => m.ModifySizeChartModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SizeChartRoutingModule { }