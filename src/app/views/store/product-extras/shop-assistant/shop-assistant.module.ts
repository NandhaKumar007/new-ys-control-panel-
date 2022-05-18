import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ShopAssistantRoutingModule } from './shop-assistant-routing.module';
import { ShopAssistantComponent } from './shop-assistant.component';

@NgModule({
  declarations: [ShopAssistantComponent],
  imports: [
    SharedModule,
    ShopAssistantRoutingModule
  ]
})

export class ShopAssistantModule { }