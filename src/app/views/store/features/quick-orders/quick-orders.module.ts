import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { QuickOrdersRoutingModule } from './quick-orders-routing.module';
import { QuickOrdersComponent } from './quick-orders.component';

@NgModule({
  declarations: [QuickOrdersComponent],
  imports: [
    SharedModule,
    QuickOrdersRoutingModule
  ]
})

export class QuickOrdersModule { }