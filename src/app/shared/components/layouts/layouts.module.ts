import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';

import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { StoreLayoutComponent } from './store-layout/store-layout.component';
import { VendorAuthLayoutComponent } from './vendor-auth-layout/vendor-auth-layout.component';

import { DropdownAnchorDirective } from './layout-directives/dropdown-anchor.directive';
import { DropdownLinkDirective } from './layout-directives/dropdown-link.directive';
import { AppDropdownDirective } from './layout-directives/dropdown.directive';
import { FullScreenWindowDirective } from './layout-directives/full-screen.directive';

const components = [
  AuthLayoutComponent,
  AdminLayoutComponent,
  StoreLayoutComponent,
  VendorAuthLayoutComponent,

  DropdownAnchorDirective,
  DropdownLinkDirective,
  AppDropdownDirective,
  FullScreenWindowDirective
];

@NgModule({
  imports: [
    NgbModule,
    RouterModule,
    FormsModule,
    PerfectScrollbarModule,
    CommonModule
  ],
  declarations: components,
  exports: components
})

export class LayoutsModule { }