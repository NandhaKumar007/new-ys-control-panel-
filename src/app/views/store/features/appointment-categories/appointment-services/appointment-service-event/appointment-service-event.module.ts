import { NgModule } from '@angular/core';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { SharedModule } from '../../../../../../shared/shared.module';

import { AppointmentServiceEventRoutingModule } from './appointment-service-event-routing.module';
import { AppointmentServiceEventComponent } from './appointment-service-event.component';

@NgModule({
  declarations: [AppointmentServiceEventComponent],
  imports: [
    SharedModule,
    AmazingTimePickerModule,
    AppointmentServiceEventRoutingModule
  ]
})

export class AppointmentServiceEventModule { }