import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyProductComponent } from './modify-product.component';

const routes: Routes = [{ path: '', component: ModifyProductComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModifyProductRoutingModule { }