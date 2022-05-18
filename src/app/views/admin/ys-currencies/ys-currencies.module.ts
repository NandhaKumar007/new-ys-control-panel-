import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { YsCurrenciesRoutingModule } from './ys-currencies-routing.module';
import { YsCurrenciesComponent } from './ys-currencies.component';

@NgModule({
  declarations: [YsCurrenciesComponent],
  imports: [
    SharedModule,
    YsCurrenciesRoutingModule
  ]
})

export class YsCurrenciesModule { }