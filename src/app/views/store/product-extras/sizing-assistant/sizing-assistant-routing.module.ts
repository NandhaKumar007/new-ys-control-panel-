import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SizingAssistantComponent } from './sizing-assistant.component';

const routes: Routes = [
  { path: '', component: SizingAssistantComponent },
  { path: ':id', loadChildren: () => import('./modify-sizing-assistant/modify-sizing-assistant.module').then(m => m.ModifySizingAssistantModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SizingAssistantRoutingModule { }