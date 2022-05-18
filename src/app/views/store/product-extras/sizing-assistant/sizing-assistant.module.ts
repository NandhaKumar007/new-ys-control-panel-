import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { SizingAssistantRoutingModule } from './sizing-assistant-routing.module';
import { SizingAssistantComponent } from './sizing-assistant.component';

@NgModule({
  declarations: [SizingAssistantComponent],
  imports: [
    SharedModule,
    SizingAssistantRoutingModule
  ]
})

export class SizingAssistantModule { }