import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyCollectionsComponent } from './modify-collections.component';

const routes: Routes = [{ path: '', component: ModifyCollectionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModifyCollectionsRoutingModule { }