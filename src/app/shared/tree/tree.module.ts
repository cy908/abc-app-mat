import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material.module';
import { TreeComponent } from './tree.component';

@NgModule({
  declarations: [
    TreeComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    TreeComponent,
  ]
})
export class TreeModule { }
