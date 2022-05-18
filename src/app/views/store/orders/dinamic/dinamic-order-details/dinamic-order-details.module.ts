import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { DinamicOrderDetailsRoutingModule } from './dinamic-order-details-routing.module';
import { DinamicOrderDetailsComponent } from './dinamic-order-details.component';

@NgModule({
  declarations: [DinamicOrderDetailsComponent],
  imports: [
    SharedModule,
    DinamicOrderDetailsRoutingModule
  ]
})

export class DinamicOrderDetailsModule { }