import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { ModifySizeChartRoutingModule } from './modify-size-chart-routing.module';
import { ModifySizeChartComponent } from './modify-size-chart.component';

@NgModule({
  declarations: [ModifySizeChartComponent],
  imports: [
    SharedModule,
    ModifySizeChartRoutingModule
  ]
})

export class ModifySizeChartModule { }