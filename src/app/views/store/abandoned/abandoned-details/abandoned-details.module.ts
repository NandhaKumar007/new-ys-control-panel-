import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { AbandonedDetailsRoutingModule } from './abandoned-details-routing.module';
import { AbandonedDetailsComponent } from './abandoned-details.component';

@NgModule({
  declarations: [AbandonedDetailsComponent],
  imports: [
    SharedModule,
    AbandonedDetailsRoutingModule
  ]
})

export class AbandonedDetailsModule { }