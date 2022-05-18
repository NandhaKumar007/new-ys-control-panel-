import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';

import { HomeLayoutRoutingModule } from './home-layout-routing.module';
import { HomeLayoutComponent } from './home-layout.component';

@NgModule({
  declarations: [HomeLayoutComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    SharedModule,
    HomeLayoutRoutingModule
  ]
})

export class HomeLayoutModule { }