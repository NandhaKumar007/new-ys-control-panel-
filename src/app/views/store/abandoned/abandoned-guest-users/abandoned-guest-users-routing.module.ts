import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbandonedGuestUsersComponent } from './abandoned-guest-users.component';

const routes: Routes = [{ path: "", component: AbandonedGuestUsersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AbandonedGuestUsersRoutingModule { }