import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuSectionsComponent } from './menu-sections.component';

const routes: Routes = [{ path: '', component: MenuSectionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MenuSectionsRoutingModule { }