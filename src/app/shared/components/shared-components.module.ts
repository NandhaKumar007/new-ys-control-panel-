import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnLoadingComponent } from './btn-loading/btn-loading.component';
import { CustomizationDetailsComponent } from './customization-details/customization-details.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LayoutsModule } from './layouts/layouts.module';

const components = [
  BtnLoadingComponent,
  CustomizationDetailsComponent,
  SpinnerComponent
];

@NgModule({
  imports: [
    CommonModule,
    LayoutsModule
  ],
  declarations: components,
  exports: components
})

export class SharedComponentsModule { }