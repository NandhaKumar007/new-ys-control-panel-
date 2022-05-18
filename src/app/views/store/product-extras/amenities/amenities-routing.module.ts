import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AmenitiesComponent } from './amenities.component';

const routes: Routes = [{ path: "", component: AmenitiesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AmenitiesRoutingModule { }