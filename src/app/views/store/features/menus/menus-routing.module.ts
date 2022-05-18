import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenusComponent } from './menus.component';

const routes: Routes = [
  { path: '', component: MenusComponent },
  { path: ':menu_id', loadChildren: () => import('./menu-sections/menu-sections.module').then(m => m.MenuSectionsModule) },
  { path: ':menu_id/:section_id', loadChildren: () => import('./menu-sections/menu-categories/menu-categories.module').then(m => m.MenuCategoriesModule) },
  { path: ':menu_id/:section_id/:category_id', loadChildren: () => import('./menu-sections/menu-categories/menu-sub-categories/menu-sub-categories.module').then(m => m.MenuSubCategoriesModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MenusRoutingModule { }