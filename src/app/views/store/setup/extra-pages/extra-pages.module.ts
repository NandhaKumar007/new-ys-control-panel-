import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ExtraPagesRoutingModule } from './extra-pages-routing.module';
import { ExtraPagesComponent } from './extra-pages.component';

@NgModule({
  declarations: [ExtraPagesComponent],
  imports: [
    SharedModule,
    ExtraPagesRoutingModule
  ]
})

export class ExtraPagesModule { }