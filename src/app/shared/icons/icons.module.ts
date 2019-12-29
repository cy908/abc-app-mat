import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';
import { IconsComponent } from './icons.component';
import { IconsService } from './icons.service';

@NgModule({
  declarations: [
    IconsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [
    IconsService,
  ],
  exports: [
    IconsComponent,
  ],
  entryComponents: [
    IconsComponent,
  ]
})
export class IconsModule { }
