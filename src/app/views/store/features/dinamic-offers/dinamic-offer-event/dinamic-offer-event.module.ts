import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../../../shared/shared.module';
import { environment } from '../../../../../../environments/environment';

import { DinamicOfferEventRoutingModule } from './dinamic-offer-event-routing.module';
import { DinamicOfferEventComponent } from './dinamic-offer-event.component';


@NgModule({
  declarations: [DinamicOfferEventComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    SharedModule,
    DinamicOfferEventRoutingModule
  ]
})
export class DinamicOfferEventModule { }
