import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';

import { MenuCategoriesRoutingModule } from './menu-categories-routing.module';
import { MenuCategoriesComponent } from './menu-categories.component';

@NgModule({
  declarations: [MenuCategoriesComponent],
  imports: [
    SharedModule,
    MenuCategoriesRoutingModule
  ]
})

export class MenuCategoriesModule { }