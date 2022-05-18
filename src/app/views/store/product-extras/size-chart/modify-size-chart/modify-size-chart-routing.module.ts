import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifySizeChartComponent } from './modify-size-chart.component';

const routes: Routes = [{ path: '', component: ModifySizeChartComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModifySizeChartRoutingModule { }