import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeployPackagesComponent } from './deploy-packages.component';

const routes: Routes = [{ path: "", component: DeployPackagesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DeployPackagesRoutingModule { }