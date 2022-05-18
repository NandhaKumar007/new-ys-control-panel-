import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { DinamicOffersRoutingModule } from './dinamic-offers-routing.module';
import { DinamicOffersComponent } from './dinamic-offers.component';


@NgModule({
  declarations: [DinamicOffersComponent],
  imports: [
    SharedModule,
    DinamicOffersRoutingModule
  ]
})
export class DinamicOffersModule { }
