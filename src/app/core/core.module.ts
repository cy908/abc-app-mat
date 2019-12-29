import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';

import { SharedModule } from '../shared';
import { DialogAlertComponent } from './dialog/dialog-alert.component';
import { DialogConfirmComponent } from './dialog/dialog-confirm.component';
import { LoadingComponent } from './loading/loading.component';
import { MessageComponent } from './message/message.component';

@NgModule({
  declarations: [
    DialogAlertComponent,
    DialogConfirmComponent,
    LoadingComponent,
    MessageComponent,
  ],
  imports: [
    SharedModule,
  ],
  entryComponents: [
    DialogAlertComponent,
    DialogConfirmComponent,
    LoadingComponent,
    MessageComponent,
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

}
