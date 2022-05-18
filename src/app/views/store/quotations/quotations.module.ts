import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';

import { QuotationsRoutingModule } from './quotations-routing.module';
import { QuotationsComponent } from './quotations.component';

@NgModule({
  declarations: [QuotationsComponent],
  imports: [
    SharedModule,
    QuotationsRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class QuotationsModule { }