import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddonsComponent } from './addons.component';

const routes: Routes = [
  { path: '', component: AddonsComponent },
  { path: 'add/:rank', loadChildren: () => import('./modify-addons/modify-addons.module').then(m => m.ModifyAddonsModule) },
  { path: 'modify/:addon_id/:rank', loadChildren: () => import('./modify-addons/modify-addons.module').then(m => m.ModifyAddonsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AddonsRoutingModule { }