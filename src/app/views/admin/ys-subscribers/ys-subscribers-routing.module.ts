import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YsSubscribersComponent } from './ys-subscribers.component';

const routes: Routes = [{ path: '', component: YsSubscribersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsSubscribersRoutingModule { }