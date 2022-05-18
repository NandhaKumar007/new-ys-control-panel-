import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { DpWalletMgmtRoutingModule } from './dp-wallet-mgmt-routing.module';
import { DpWalletMgmtComponent } from './dp-wallet-mgmt.component';

@NgModule({
  declarations: [DpWalletMgmtComponent],
  imports: [
    SharedModule,
    DpWalletMgmtRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class DpWalletMgmtModule { }