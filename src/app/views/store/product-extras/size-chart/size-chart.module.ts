import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { SizeChartRoutingModule } from './size-chart-routing.module';
import { SizeChartComponent } from './size-chart.component';

@NgModule({
  declarations: [SizeChartComponent],
  imports: [
    SharedModule,
    SizeChartRoutingModule
  ]
})

export class SizeChartModule { }