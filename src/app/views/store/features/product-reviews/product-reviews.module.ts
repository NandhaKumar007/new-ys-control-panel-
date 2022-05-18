import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { ProductReviewsRoutingModule } from './product-reviews-routing.module';
import { ProductReviewsComponent } from './product-reviews.component';

@NgModule({
  declarations: [ProductReviewsComponent],
  imports: [
    SharedModule,
    ProductReviewsRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class ProductReviewsModule { }