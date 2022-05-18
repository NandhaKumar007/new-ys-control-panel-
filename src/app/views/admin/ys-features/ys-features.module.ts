import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { YsFeaturesRoutingModule } from './ys-features-routing.module';
import { YsFeaturesComponent } from './ys-features.component';

@NgModule({
  declarations: [YsFeaturesComponent],
  imports: [
    SharedModule,
    YsFeaturesRoutingModule
  ]
})

export class YsFeaturesModule { }