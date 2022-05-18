import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopAssistantComponent } from './shop-assistant.component';

const routes: Routes = [{ path: '', component: ShopAssistantComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ShopAssistantRoutingModule { }