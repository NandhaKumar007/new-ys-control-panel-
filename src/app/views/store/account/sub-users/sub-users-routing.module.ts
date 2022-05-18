import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubUsersComponent } from './sub-users.component';

const routes: Routes = [{ path: '', component: SubUsersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SubUsersRoutingModule { }