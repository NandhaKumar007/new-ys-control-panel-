import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { AppStorePaymentsRoutingModule } from './app-store-payments-routing.module';
import { AppStorePaymentsComponent } from './app-store-payments.component';

@NgModule({
  declarations: [AppStorePaymentsComponent],
  imports: [
    SharedModule,
    AppStorePaymentsRoutingModule
  ]
})

export class AppStorePaymentsModule { }