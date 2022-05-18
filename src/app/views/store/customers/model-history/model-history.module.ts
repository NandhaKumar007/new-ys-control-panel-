import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ModelHistoryRoutingModule } from './model-history-routing.module';
import { ModelHistoryComponent } from './model-history.component';

@NgModule({
  declarations: [ModelHistoryComponent],
  imports: [
    SharedModule,
    ModelHistoryRoutingModule
  ]
})

export class ModelHistoryModule { }