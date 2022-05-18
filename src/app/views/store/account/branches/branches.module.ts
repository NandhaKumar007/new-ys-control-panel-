import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { BranchesRoutingModule } from './branches-routing.module';
import { BranchesComponent } from './branches.component';

@NgModule({
  declarations: [BranchesComponent],
  imports: [
    SharedModule,
    BranchesRoutingModule
  ]
})

export class BranchesModule { }