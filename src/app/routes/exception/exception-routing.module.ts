import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Exception404Component } from './exception404/exception404.component';

const routes: Routes = [
  { path: '404', component: Exception404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExceptionRoutingModule { }
