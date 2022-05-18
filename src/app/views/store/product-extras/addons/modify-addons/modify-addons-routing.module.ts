import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyAddonsComponent } from './modify-addons.component';

const routes: Routes = [{ path: '', component: ModifyAddonsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModifyAddonsRoutingModule { }