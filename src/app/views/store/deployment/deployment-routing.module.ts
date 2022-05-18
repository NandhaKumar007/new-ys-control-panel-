import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'domain', loadChildren: () => import('./deploy-domain/deploy-domain.module').then(m => m.DeployDomainModule) },
  { path: 'plans', loadChildren: () => import('./deploy-packages/deploy-packages.module').then(m => m.DeployPackagesModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DeploymentRoutingModule { }