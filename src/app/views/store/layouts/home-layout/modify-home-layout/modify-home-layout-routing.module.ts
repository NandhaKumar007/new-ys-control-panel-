import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyHomeLayoutComponent } from './modify-home-layout.component';

const routes: Routes = [{ path: '', component: ModifyHomeLayoutComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModifyHomeLayoutRoutingModule { }