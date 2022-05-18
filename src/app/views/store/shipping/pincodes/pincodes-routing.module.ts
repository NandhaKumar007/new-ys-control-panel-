import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PincodesComponent } from './pincodes.component';

const routes: Routes = [{ path: '', component: PincodesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PincodesRoutingModule { }