import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { AbandonedGuestUsersRoutingModule } from './abandoned-guest-users-routing.module';
import { AbandonedGuestUsersComponent } from './abandoned-guest-users.component';

@NgModule({
  declarations: [AbandonedGuestUsersComponent],
  imports: [
    SharedModule,
    AbandonedGuestUsersRoutingModule
  ]
})

export class AbandonedGuestUsersModule { }