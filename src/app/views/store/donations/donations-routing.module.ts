import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonationsComponent } from './donations.component';

const routes: Routes = [
  { path: '', component: DonationsComponent },
  { path: 'inactive', loadChildren: () => import('./inactive-donations/inactive-donations.module').then(m => m.InactiveDonationsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DonationsRoutingModule { }