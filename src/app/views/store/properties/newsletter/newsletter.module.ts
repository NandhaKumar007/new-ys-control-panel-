import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { NewsletterRoutingModule } from './newsletter-routing.module';
import { NewsletterComponent } from './newsletter.component';

@NgModule({
  declarations: [NewsletterComponent],
  imports: [
    SharedModule,
    NewsletterRoutingModule
  ]
})

export class NewsletterModule { }