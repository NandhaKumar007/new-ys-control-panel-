import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { GuestUsersRoutingModule } from './guest-users-routing.module';
import { GuestUsersComponent } from './guest-users.component';

@NgModule({
  declarations: [GuestUsersComponent],
  imports: [
    SharedModule,
    GuestUsersRoutingModule
  ]
})

export class GuestUsersModule { }