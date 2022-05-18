import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { WelcomeScreenRoutingModule } from './welcome-screen-routing.module';
import { WelcomeScreenComponent } from './welcome-screen.component';

@NgModule({
  declarations: [WelcomeScreenComponent],
  imports: [
    SharedModule,
    WelcomeScreenRoutingModule
  ]
})

export class WelcomeScreenModule { }