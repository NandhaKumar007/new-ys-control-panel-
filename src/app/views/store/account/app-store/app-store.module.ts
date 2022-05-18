import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { AppStoreRoutingModule } from './app-store-routing.module';
import { AppStoreComponent } from './app-store.component';

@NgModule({
  declarations: [AppStoreComponent],
  imports: [
    SharedModule,
    AppStoreRoutingModule
  ]
})

export class AppStoreModule { }