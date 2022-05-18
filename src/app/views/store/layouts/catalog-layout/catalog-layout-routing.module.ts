import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogLayoutComponent } from './catalog-layout.component';

const routes: Routes = [{ path: '', component: CatalogLayoutComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogLayoutRoutingModule { }