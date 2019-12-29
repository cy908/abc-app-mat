import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExceptionRoutingModule } from './exception-routing.module';
import { Exception404Component } from './exception404/exception404.component';

@NgModule({
  declarations: [
    Exception404Component,
  ],
  imports: [
    CommonModule,
    ExceptionRoutingModule,
  ]
})
export class ExceptionModule { }
