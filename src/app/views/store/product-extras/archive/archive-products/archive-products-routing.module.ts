import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArchiveProductsComponent } from './archive-products.component';

const routes: Routes = [{ path: '', component: ArchiveProductsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ArchiveProductsRoutingModule { }