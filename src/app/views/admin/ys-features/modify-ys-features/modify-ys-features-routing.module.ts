import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyYsFeaturesComponent } from './modify-ys-features.component';

const routes: Routes = [{ path: '', component: ModifyYsFeaturesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModifyYsFeaturesRoutingModule { }