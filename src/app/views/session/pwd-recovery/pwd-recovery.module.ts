import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { PwdRecoveryRoutingModule } from './pwd-recovery-routing.module';
import { PwdRecoveryComponent } from './pwd-recovery.component';

@NgModule({
  declarations: [PwdRecoveryComponent],
  imports: [
    SharedModule,
    PwdRecoveryRoutingModule
  ]
})

export class PwdRecoveryModule { }