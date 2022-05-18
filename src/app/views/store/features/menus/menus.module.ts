import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { MenusRoutingModule } from './menus-routing.module';
import { MenusComponent } from './menus.component';

@NgModule({
  declarations: [MenusComponent],
  imports: [
    SharedModule,
    MenusRoutingModule
  ]
})

export class MenusModule { }