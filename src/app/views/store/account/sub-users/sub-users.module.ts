import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { SubUsersRoutingModule } from './sub-users-routing.module';
import { SubUsersComponent } from './sub-users.component';

@NgModule({
  declarations: [SubUsersComponent],
  imports: [
    SharedModule,
    SubUsersRoutingModule
  ]
})

export class SubUsersModule { }