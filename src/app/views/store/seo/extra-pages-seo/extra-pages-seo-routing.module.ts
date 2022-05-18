import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtraPagesSeoComponent } from './extra-pages-seo.component';

const routes: Routes = [{ path: "", component: ExtraPagesSeoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ExtraPagesSeoRoutingModule { }