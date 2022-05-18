import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyYsClientsComponent } from './modify-ys-clients.component';

const routes: Routes = [{ path: '', component: ModifyYsClientsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModifyYsClientsRoutingModule { }