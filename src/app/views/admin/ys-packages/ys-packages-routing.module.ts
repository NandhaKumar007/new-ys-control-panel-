import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YsPackagesComponent } from './ys-packages.component';

const routes: Routes = [{ path: '', component: YsPackagesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsPackagesRoutingModule { }