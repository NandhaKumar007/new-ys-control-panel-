import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { MeasurementsRoutingModule } from './measurements-routing.module';
import { MeasurementsComponent } from './measurements.component';

@NgModule({
  declarations: [MeasurementsComponent],
  imports: [
    SharedModule,
    MeasurementsRoutingModule
  ]
})

export class MeasurementsModule { }