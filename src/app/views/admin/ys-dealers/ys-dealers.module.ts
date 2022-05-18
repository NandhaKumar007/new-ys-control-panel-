import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { YsDealersRoutingModule } from './ys-dealers-routing.module';
import { YsDealersComponent } from './ys-dealers.component';

@NgModule({
  declarations: [YsDealersComponent],
  imports: [
    SharedModule,
    YsDealersRoutingModule
  ]
})

export class YsDealersModule { }