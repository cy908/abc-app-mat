import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { IconsComponent } from './icons.component';

@Injectable()
export class IconsService {

  constructor(
    private dialog: MatDialog,
  ) { }

  icons() {
    this.dialog.open(IconsComponent);
  }

}
