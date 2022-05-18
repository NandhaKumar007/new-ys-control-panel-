import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';

import { YsDashboardRoutingModule } from './ys-dashboard-routing.module';
import { YsDashboardComponent } from './ys-dashboard.component';

@NgModule({
  declarations: [YsDashboardComponent],
  imports: [
    SharedModule,
    NgxEchartsModule,
    YsDashboardRoutingModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [DatePipe]
})

export class YsDashboardModule { }