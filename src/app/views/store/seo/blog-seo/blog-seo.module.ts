import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../shared/shared.module';

import { BlogSeoRoutingModule } from './blog-seo-routing.module';
import { BlogSeoComponent } from './blog-seo.component';

@NgModule({
  declarations: [BlogSeoComponent],
  imports: [
    SharedModule,
    TagInputModule,
    BlogSeoRoutingModule
  ]
})

export class BlogSeoModule { }