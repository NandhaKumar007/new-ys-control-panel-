import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { YsSubscribersRoutingModule } from './ys-subscribers-routing.module';
import { YsSubscribersComponent } from './ys-subscribers.component';

@NgModule({
  declarations: [YsSubscribersComponent],
  imports: [
    SharedModule,
    YsSubscribersRoutingModule
  ]
})

export class YsSubscribersModule { }