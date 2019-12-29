import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { UserRoutingModule } from './user-routing.module';
import { UserInfoComponent } from './user-info/user-info.component';

@NgModule({
  declarations: [
    UserInfoComponent,
  ],
  imports: [
    SharedModule,
    UserRoutingModule,
  ]
})
export class UserModule { }
