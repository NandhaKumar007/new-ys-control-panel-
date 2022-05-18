import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { DiscountsPageRoutingModule } from './discounts-page-routing.module';
import { DiscountsPageComponent } from './discounts-page.component';

@NgModule({
  declarations: [DiscountsPageComponent],
  imports: [
    SharedModule,
    DiscountsPageRoutingModule
  ]
})

export class DiscountsPageModule { }