import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreSeoComponent } from './store-seo.component';

const routes: Routes = [{ path: '', component: StoreSeoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class StoreSeoRoutingModule { }