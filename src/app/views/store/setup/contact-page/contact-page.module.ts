import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';

import { ContactPageRoutingModule } from './contact-page-routing.module';
import { ContactPageComponent } from './contact-page.component';

@NgModule({
  declarations: [ContactPageComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    SharedModule,
    ContactPageRoutingModule
  ]
})

export class ContactPageModule { }