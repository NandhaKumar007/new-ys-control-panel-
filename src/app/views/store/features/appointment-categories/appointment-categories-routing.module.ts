import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentCategoriesComponent } from './appointment-categories.component';

const routes: Routes = [
  { path: "", component: AppointmentCategoriesComponent },
  { path: ':category_id', loadChildren: () => import('./appointment-services/appointment-services.module').then(m => m.AppointmentServicesModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppointmentCategoriesRoutingModule { }