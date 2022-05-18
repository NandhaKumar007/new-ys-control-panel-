import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeployDomainComponent } from './deploy-domain.component';

const routes: Routes = [{ path: "", component: DeployDomainComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DeployDomainRoutingModule { }