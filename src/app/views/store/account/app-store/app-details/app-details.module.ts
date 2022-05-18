import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { AppDetailsRoutingModule } from './app-details-routing.module';
import { AppDetailsComponent } from './app-details.component';

@NgModule({
  declarations: [AppDetailsComponent],
  imports: [
    SharedModule,
    AppDetailsRoutingModule
  ]
})

export class AppDetailsModule { }