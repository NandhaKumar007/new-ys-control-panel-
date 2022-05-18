import { NgModule } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { SharedModule } from '../../../../shared/shared.module';

import { LogoManagementRoutingModule } from './logo-management-routing.module';
import { LogoManagementComponent } from './logo-management.component';

@NgModule({
  declarations: [LogoManagementComponent],
  imports: [
    SharedModule,
    ColorPickerModule,
    LogoManagementRoutingModule
  ]
})

export class LogoManagementModule { }