import { NgModule } from '@angular/core';
import { LaddaModule } from 'angular2-ladda';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedPipesModule } from './pipes/shared-pipes.module';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { SharedComponentsModule } from './components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    RouterModule,
    NgxPaginationModule,
    LaddaModule.forRoot({ style: 'expand-left'}),

    SharedPipesModule,
    SharedDirectivesModule,
    SharedComponentsModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    RouterModule,
    NgxPaginationModule,
    LaddaModule,

    SharedPipesModule,
    SharedDirectivesModule,
    SharedComponentsModule
  ]
})

export class SharedModule { }