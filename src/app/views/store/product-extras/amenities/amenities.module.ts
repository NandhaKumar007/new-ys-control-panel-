import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { AmenitiesRoutingModule } from './amenities-routing.module';
import { AmenitiesComponent } from './amenities.component';

@NgModule({
  declarations: [AmenitiesComponent],
  imports: [
    SharedModule,
    AmenitiesRoutingModule
  ]
})

export class AmenitiesModule { }