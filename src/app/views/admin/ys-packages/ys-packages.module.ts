import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { YsPackagesRoutingModule } from './ys-packages-routing.module';
import { YsPackagesComponent } from './ys-packages.component';

@NgModule({
  declarations: [YsPackagesComponent],
  imports: [
    SharedModule,
    YsPackagesRoutingModule
  ]
})

export class YsPackagesModule { }