import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuCategoriesComponent } from './menu-categories.component';

const routes: Routes = [{ path: '', component: MenuCategoriesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MenuCategoriesRoutingModule { }