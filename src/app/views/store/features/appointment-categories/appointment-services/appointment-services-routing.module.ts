import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentServicesComponent } from './appointment-services.component';

const routes: Routes = [
  { path: "", component: AppointmentServicesComponent },
  { path: 'add/:rank', loadChildren: () => import('./appointment-service-event/appointment-service-event.module').then(m => m.AppointmentServiceEventModule) },
  { path: 'modify/:id/:rank', loadChildren: () => import('./appointment-service-event/appointment-service-event.module').then(m => m.AppointmentServiceEventModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppointmentServicesRoutingModule { }