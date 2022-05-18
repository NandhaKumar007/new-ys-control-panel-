import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../shared/shared.module';

import { ExtraPagesSeoRoutingModule } from './extra-pages-seo-routing.module';
import { ExtraPagesSeoComponent } from './extra-pages-seo.component';

@NgModule({
  declarations: [ExtraPagesSeoComponent],
  imports: [
    SharedModule,
    TagInputModule,
    ExtraPagesSeoRoutingModule
  ]
})

export class ExtraPagesSeoModule { }