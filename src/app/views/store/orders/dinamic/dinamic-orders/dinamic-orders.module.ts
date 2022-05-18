import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { DinamicOrdersRoutingModule } from './dinamic-orders-routing.module';
import { DinamicOrdersComponent } from './dinamic-orders.component';

@NgModule({
  declarations: [DinamicOrdersComponent],
  imports: [
    SharedModule,
    DinamicOrdersRoutingModule
  ]
})

export class DinamicOrdersModule { }