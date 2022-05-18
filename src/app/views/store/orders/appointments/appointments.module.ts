import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsComponent } from './appointments.component';

@NgModule({
  declarations: [AppointmentsComponent],
  imports: [
    SharedModule,
    BsDatepickerModule.forRoot(),
    AppointmentsRoutingModule
  ]
})

export class AppointmentsModule { }