import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YsDealersComponent } from './ys-dealers.component';

const routes: Routes = [{ path: '', component: YsDealersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsDealersRoutingModule { }