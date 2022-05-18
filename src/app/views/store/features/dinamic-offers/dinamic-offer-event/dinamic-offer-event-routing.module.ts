import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DinamicOfferEventComponent } from './dinamic-offer-event.component';

const routes: Routes = [{ path: "", component: DinamicOfferEventComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DinamicOfferEventRoutingModule { }