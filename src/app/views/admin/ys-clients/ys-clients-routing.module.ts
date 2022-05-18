import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YsClientsComponent } from './ys-clients.component';

const routes: Routes = [
  { path: '', component: YsClientsComponent },
  { path: 'add', loadChildren: () => import('./modify-ys-clients/modify-ys-clients.module').then(m => m.ModifyYsClientsModule) },
  { path: 'update/:client_id', loadChildren: () => import('./modify-ys-clients/modify-ys-clients.module').then(m => m.ModifyYsClientsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsClientsRoutingModule { }