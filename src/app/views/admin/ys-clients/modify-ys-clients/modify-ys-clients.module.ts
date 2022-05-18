import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { ModifyYsClientsRoutingModule } from './modify-ys-clients-routing.module';
import { ModifyYsClientsComponent } from './modify-ys-clients.component';

@NgModule({
  declarations: [ModifyYsClientsComponent],
  imports: [
    SharedModule,
    ModifyYsClientsRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class ModifyYsClientsModule { }