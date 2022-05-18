import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuSubCategoriesComponent } from './menu-sub-categories.component';

const routes: Routes = [{ path: '', component: MenuSubCategoriesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MenuSubCategoriesRoutingModule { }