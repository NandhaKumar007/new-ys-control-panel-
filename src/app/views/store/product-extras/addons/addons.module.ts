import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { AddonsRoutingModule } from './addons-routing.module';
import { AddonsComponent } from './addons.component';

@NgModule({
  declarations: [AddonsComponent],
  imports: [
    SharedModule,
    AddonsRoutingModule
  ]
})

export class AddonsModule { }