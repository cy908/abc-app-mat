import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { NoticeRoutingModule } from './notice-routing.module';
import { NoticeListComponent } from './notice-list/notice-list.component';
import { NoticeInfoComponent } from './notice-info/notice-info.component';

@NgModule({
  declarations: [
    NoticeListComponent,
    NoticeInfoComponent,
  ],
  imports: [
    SharedModule,
    NoticeRoutingModule,
  ]
})
export class NoticeModule { }
