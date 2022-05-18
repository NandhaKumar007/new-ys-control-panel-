import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollectionsComponent } from './collections.component';

const routes: Routes = [
  { path: '', component: CollectionsComponent },
  { path: 'add/:rank', loadChildren: () => import('./modify-collections/modify-collections.module').then(m => m.ModifyCollectionsModule) },
  { path: 'modify/:collection_id/:rank', loadChildren: () => import('./modify-collections/modify-collections.module').then(m => m.ModifyCollectionsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CollectionsRoutingModule { }