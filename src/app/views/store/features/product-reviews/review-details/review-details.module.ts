import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../../shared/shared.module';
import { environment } from '../../../../../../environments/environment';

import { ReviewDetailsRoutingModule } from './review-details-routing.module';
import { ReviewDetailsComponent } from './review-details.component';

@NgModule({
  declarations: [ReviewDetailsComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    SharedModule,
    ReviewDetailsRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class ReviewDetailsModule { }