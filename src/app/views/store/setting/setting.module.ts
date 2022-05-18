import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { ColorPickerModule } from 'ngx-color-picker';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';

@NgModule({
  declarations: [SettingComponent],
  imports: [
    AmazingTimePickerModule,
    SharedModule,
    TagInputModule,
    ColorPickerModule,
    BsDatepickerModule.forRoot(),
    SettingRoutingModule
  ]
})

export class SettingModule { }