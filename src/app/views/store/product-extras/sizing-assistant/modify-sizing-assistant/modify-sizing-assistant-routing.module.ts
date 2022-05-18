import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifySizingAssistantComponent } from './modify-sizing-assistant.component';

const routes: Routes = [{ path: '', component: ModifySizingAssistantComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModifySizingAssistantRoutingModule { }