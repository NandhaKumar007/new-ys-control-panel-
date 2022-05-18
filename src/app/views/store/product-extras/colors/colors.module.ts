import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ColorsRoutingModule } from './colors-routing.module';
import { ColorsComponent } from './colors.component';

@NgModule({
  declarations: [ColorsComponent],
  imports: [
    SharedModule,
    ColorsRoutingModule
  ]
})

export class ColorsModule { }