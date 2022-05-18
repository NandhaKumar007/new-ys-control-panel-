import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';

import { FooterContentRoutingModule } from './footer-content-routing.module';
import { FooterContentComponent } from './footer-content.component';

@NgModule({
  declarations: [FooterContentComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    SharedModule,
    FooterContentRoutingModule
  ]
})

export class FooterContentModule { }