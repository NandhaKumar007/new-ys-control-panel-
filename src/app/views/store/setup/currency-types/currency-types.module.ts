import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { CurrencyTypesRoutingModule } from './currency-types-routing.module';
import { CurrencyTypesComponent } from './currency-types.component';

@NgModule({
  declarations: [CurrencyTypesComponent],
  imports: [
    SharedModule,
    CurrencyTypesRoutingModule
  ]
})

export class CurrencyTypesModule { }