import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogSeoComponent } from './blog-seo.component';

const routes: Routes = [{ path: '', component: BlogSeoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BlogSeoRoutingModule { }