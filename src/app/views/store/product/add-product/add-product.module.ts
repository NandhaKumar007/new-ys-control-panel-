import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { ImageCropperModule } from 'ngx-img-cropper';
import { QuillModule } from 'ngx-quill';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';

import { AddProductRoutingModule } from './add-product-routing.module';
import { AddProductComponent } from './add-product.component';

@NgModule({
  declarations: [AddProductComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    TagInputModule,
    ImageCropperModule,
    AmazingTimePickerModule,
    SharedModule,
    AddProductRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class AddProductModule { }