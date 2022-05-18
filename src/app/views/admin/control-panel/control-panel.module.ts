import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { ControlPanelRoutingModule } from './control-panel-routing.module';
import { ControlPanelComponent } from './control-panel.component';

@NgModule({
  declarations: [ControlPanelComponent],
  imports: [
    SharedModule,
    ControlPanelRoutingModule
  ]
})

export class ControlPanelModule { }