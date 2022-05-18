import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { InactiveDinamicOrdersRoutingModule } from './inactive-dinamic-orders-routing.module';
import { InactiveDinamicOrdersComponent } from './inactive-dinamic-orders.component';

@NgModule({
  declarations: [InactiveDinamicOrdersComponent],
  imports: [
    SharedModule,
    InactiveDinamicOrdersRoutingModule
  ]
})

export class InactiveDinamicOrdersModule { }