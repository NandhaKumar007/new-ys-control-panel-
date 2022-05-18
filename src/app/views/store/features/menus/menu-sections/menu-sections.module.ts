import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { MenuSectionsRoutingModule } from './menu-sections-routing.module';
import { MenuSectionsComponent } from './menu-sections.component';

@NgModule({
  declarations: [MenuSectionsComponent],
  imports: [
    SharedModule,
    MenuSectionsRoutingModule
  ]
})

export class MenuSectionsModule { }