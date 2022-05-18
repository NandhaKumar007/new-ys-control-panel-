import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';

import { PoliciesRoutingModule } from './policies-routing.module';
import { PoliciesComponent } from './policies.component';

@NgModule({
  declarations: [PoliciesComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    SharedModule,
    PoliciesRoutingModule
  ]
})

export class PoliciesModule { }