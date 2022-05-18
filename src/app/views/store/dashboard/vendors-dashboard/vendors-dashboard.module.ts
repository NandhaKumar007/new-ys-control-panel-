import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { VendorsDashboardRoutingModule } from './vendors-dashboard-routing.module';
import { VendorsDashboardComponent } from './vendors-dashboard.component';

@NgModule({
  declarations: [VendorsDashboardComponent],
  imports: [
    NgxEchartsModule,
    SharedModule,
    VendorsDashboardRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class VendorsDashboardModule { }