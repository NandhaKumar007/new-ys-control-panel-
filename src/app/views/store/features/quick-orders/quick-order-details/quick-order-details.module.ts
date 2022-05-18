import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { SharedModule } from '../../../../../shared/shared.module';

import { QuickOrderDetailsRoutingModule } from './quick-order-details-routing.module';
import { QuickOrderDetailsComponent } from './quick-order-details.component';

@NgModule({
  declarations: [QuickOrderDetailsComponent],
  imports: [
    SharedModule,
    AmazingTimePickerModule,
    QuickOrderDetailsRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class QuickOrderDetailsModule { }