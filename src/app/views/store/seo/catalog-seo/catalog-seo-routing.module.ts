import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogSeoComponent } from './catalog-seo.component';

const routes: Routes = [{ path: '', component: CatalogSeoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogSeoRoutingModule { }