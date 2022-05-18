import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { ModifyHomeLayoutRoutingModule } from './modify-home-layout-routing.module';
import { ModifyHomeLayoutComponent } from './modify-home-layout.component';

@NgModule({
  declarations: [ModifyHomeLayoutComponent],
  imports: [
    SharedModule,
    ModifyHomeLayoutRoutingModule
  ]
})

export class ModifyHomeLayoutModule { }