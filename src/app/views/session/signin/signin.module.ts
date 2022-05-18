import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { SigninRoutingModule } from './signin-routing.module';
import { SigninComponent } from './signin.component';

@NgModule({
  declarations: [SigninComponent],
  imports: [
    SharedModule,
    SigninRoutingModule
  ]
})

export class SigninModule { }