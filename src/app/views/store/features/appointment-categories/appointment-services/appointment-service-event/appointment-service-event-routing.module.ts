import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentServiceEventComponent } from './appointment-service-event.component';

const routes: Routes = [{ path: "", component: AppointmentServiceEventComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppointmentServiceEventRoutingModule { }