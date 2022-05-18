import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { InactiveDonationsRoutingModule } from './inactive-donations-routing.module';
import { InactiveDonationsComponent } from './inactive-donations.component';

@NgModule({
  declarations: [InactiveDonationsComponent],
  imports: [
    SharedModule,
    InactiveDonationsRoutingModule
  ]
})

export class InactiveDonationsModule { }