import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../shared/shared.module';

import { PincodesRoutingModule } from './pincodes-routing.module';
import { PincodesComponent } from './pincodes.component';

@NgModule({
  declarations: [PincodesComponent],
  imports: [
    TagInputModule,
    SharedModule,
    PincodesRoutingModule
  ]
})

export class PincodesModule { }