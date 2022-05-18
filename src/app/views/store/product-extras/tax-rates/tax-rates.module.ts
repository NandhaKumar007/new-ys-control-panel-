import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { TaxRatesRoutingModule } from './tax-rates-routing.module';
import { TaxRatesComponent } from './tax-rates.component';

@NgModule({
  declarations: [TaxRatesComponent],
  imports: [
    SharedModule,
    TaxRatesRoutingModule
  ]
})

export class TaxRatesModule { }