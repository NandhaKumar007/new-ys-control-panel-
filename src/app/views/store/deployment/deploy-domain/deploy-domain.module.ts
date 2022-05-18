import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { DeployDomainRoutingModule } from './deploy-domain-routing.module';
import { DeployDomainComponent } from './deploy-domain.component';

@NgModule({
  declarations: [DeployDomainComponent],
  imports: [
    SharedModule,
    DeployDomainRoutingModule
  ]
})

export class DeployDomainModule { }