import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../../shared/shared.module';

import { MenuSubCategoriesRoutingModule } from './menu-sub-categories-routing.module';
import { MenuSubCategoriesComponent } from './menu-sub-categories.component';

@NgModule({
  declarations: [MenuSubCategoriesComponent],
  imports: [
    SharedModule,
    MenuSubCategoriesRoutingModule
  ]
})

export class MenuSubCategoriesModule { }