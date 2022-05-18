import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FooterContentComponent } from './footer-content.component';

const routes: Routes = [{ path: '', component: FooterContentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FooterContentRoutingModule { }