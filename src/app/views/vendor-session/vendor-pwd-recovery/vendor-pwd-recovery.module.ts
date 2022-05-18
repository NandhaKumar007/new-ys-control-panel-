import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { VendorPwdRecoveryRoutingModule } from './vendor-pwd-recovery-routing.module';
import { VendorPwdRecoveryComponent } from './vendor-pwd-recovery.component';

@NgModule({
  declarations: [VendorPwdRecoveryComponent],
  imports: [
    SharedModule,
    VendorPwdRecoveryRoutingModule
  ]
})

export class VendorPwdRecoveryModule { }