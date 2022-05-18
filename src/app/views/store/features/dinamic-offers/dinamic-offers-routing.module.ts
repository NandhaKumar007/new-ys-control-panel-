import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DinamicOffersComponent } from './dinamic-offers.component';

const routes: Routes = [
  { path: "", component: DinamicOffersComponent },
  { path: "add", loadChildren: () => import('./dinamic-offer-event/dinamic-offer-event.module').then(m => m.DinamicOfferEventModule) },
  { path: "modify/:id", loadChildren: () => import('./dinamic-offer-event/dinamic-offer-event.module').then(m => m.DinamicOfferEventModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DinamicOffersRoutingModule { }