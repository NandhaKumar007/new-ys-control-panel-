import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';

import { ModifyYsFeaturesRoutingModule } from './modify-ys-features-routing.module';
import { ModifyYsFeaturesComponent } from './modify-ys-features.component';

@NgModule({
  declarations: [ModifyYsFeaturesComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    SharedModule,
    ModifyYsFeaturesRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class ModifyYsFeaturesModule { }