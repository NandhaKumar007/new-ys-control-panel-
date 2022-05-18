import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';

import { DonationsRoutingModule } from './donations-routing.module';
import { DonationsComponent } from './donations.component';

@NgModule({
  declarations: [DonationsComponent],
  imports: [
    SharedModule,
    DonationsRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class DonationsModule { }