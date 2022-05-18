import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdManagementRoutingModule } from './ad-management-routing.module';
import { AdManagementComponent } from './ad-management.component';

@NgModule({
  declarations: [AdManagementComponent],
  imports: [
    CommonModule,
    AdManagementRoutingModule
  ]
})

export class AdManagementModule { }