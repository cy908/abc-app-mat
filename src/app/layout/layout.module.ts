import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';
import { LayoutDefaultComponent } from './layout-default/layout-default.component';
import { LayoutFullscreenComponent } from './layout-fullscreen/layout-fullscreen.component';

@NgModule({
  declarations: [
    LayoutDefaultComponent,
    LayoutFullscreenComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    LayoutDefaultComponent,
    LayoutFullscreenComponent,
  ]
})
export class LayoutModule { }
