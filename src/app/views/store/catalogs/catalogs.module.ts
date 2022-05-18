import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../shared/shared.module';
import { environment } from '../../../../environments/environment';

import { CatalogsRoutingModule } from './catalogs-routing.module';
import { CatalogsComponent } from './catalogs.component';

@NgModule({
  declarations: [CatalogsComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    SharedModule,
    CatalogsRoutingModule
  ]
})

export class CatalogsModule { }