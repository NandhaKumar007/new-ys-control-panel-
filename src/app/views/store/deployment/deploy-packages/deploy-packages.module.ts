import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { DeployPackagesRoutingModule } from './deploy-packages-routing.module';
import { DeployPackagesComponent } from './deploy-packages.component';

@NgModule({
  declarations: [DeployPackagesComponent],
  imports: [
    SharedModule,
    DeployPackagesRoutingModule
  ]
})

export class DeployPackagesModule { }