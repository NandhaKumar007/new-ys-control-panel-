import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeLayoutComponent } from './home-layout.component';

const routes: Routes = [
  { path: '', component: HomeLayoutComponent },
  { path: ':layout_id', loadChildren: () => import('./modify-home-layout/modify-home-layout.module').then(m => m.ModifyHomeLayoutModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HomeLayoutRoutingModule { }