import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YsFeaturesComponent } from './ys-features.component';

const routes: Routes = [
  { path: '', component: YsFeaturesComponent },
  { path: 'add', loadChildren: () => import('./modify-ys-features/modify-ys-features.module').then(m => m.ModifyYsFeaturesModule) },
  { path: 'update/:feature_id', loadChildren: () => import('./modify-ys-features/modify-ys-features.module').then(m => m.ModifyYsFeaturesModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsFeaturesRoutingModule { }