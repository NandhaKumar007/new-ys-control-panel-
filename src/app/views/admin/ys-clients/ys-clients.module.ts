import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { YsClientsRoutingModule } from './ys-clients-routing.module';
import { YsClientsComponent } from './ys-clients.component';

@NgModule({
  declarations: [YsClientsComponent],
  imports: [
    SharedModule,
    YsClientsRoutingModule
  ]
})

export class YsClientsModule { }