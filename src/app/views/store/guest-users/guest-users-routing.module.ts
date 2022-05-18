import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuestUsersComponent } from './guest-users.component';

const routes: Routes = [{ path: "", component: GuestUsersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GuestUsersRoutingModule { }