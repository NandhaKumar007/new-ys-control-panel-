import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { ModifySizingAssistantRoutingModule } from './modify-sizing-assistant-routing.module';
import { ModifySizingAssistantComponent } from './modify-sizing-assistant.component';

@NgModule({
  declarations: [ModifySizingAssistantComponent],
  imports: [
    SharedModule,
    ModifySizingAssistantRoutingModule
  ]
})

export class ModifySizingAssistantModule { }