import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArchiveComponent } from './archive.component';

const routes: Routes = [
  { path: '', component: ArchiveComponent },
  { path: 'product/:archive_id/:archive_name', loadChildren: () => import('./archive-products/archive-products.module').then(m => m.ArchiveProductsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ArchiveRoutingModule { }