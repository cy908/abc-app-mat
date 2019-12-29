import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DialogAlertComponent } from './dialog-alert.component';
import { DialogConfirmComponent } from './dialog-confirm.component';
import { DialogData } from './dialog-model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private dialog: MatDialog,
  ) { }

  alert(title: string, content?: string, ok?: string) {
    let data = new DialogData();
    data.title = title;
    data.content = content;
    data.ok = ok;
    return this.dialog.open(DialogAlertComponent, { data: data });
  }

  confirm(title: string, content?: string, yes?: string, no?: string) {
    let data = new DialogData();
    data.title = title;
    data.content = content;
    data.yes = yes;
    data.no = no;
    return this.dialog.open(DialogConfirmComponent, { data: data });
  }

}
