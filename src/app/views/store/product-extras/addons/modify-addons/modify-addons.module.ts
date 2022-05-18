import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { ModifyAddonsRoutingModule } from './modify-addons-routing.module';
import { ModifyAddonsComponent } from './modify-addons.component';

@NgModule({
  declarations: [ModifyAddonsComponent],
  imports: [
    SharedModule,
    ModifyAddonsRoutingModule
  ]
})

export class ModifyAddonsModule { }