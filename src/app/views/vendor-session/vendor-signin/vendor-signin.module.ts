import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { VendorSigninRoutingModule } from './vendor-signin-routing.module';
import { VendorSigninComponent } from './vendor-signin.component';

@NgModule({
  declarations: [VendorSigninComponent],
  imports: [
    SharedModule,
    VendorSigninRoutingModule
  ]
})

export class VendorSigninModule { }