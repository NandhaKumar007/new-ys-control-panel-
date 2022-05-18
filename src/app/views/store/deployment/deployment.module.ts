import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { DeploymentRoutingModule } from './deployment-routing.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    DeploymentRoutingModule
  ]
})

export class DeploymentModule { }