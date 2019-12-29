import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { MessageData, MessageIcon, MessageColor } from './message-model';
import { MessageComponent } from './message.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  success(message: string) {
    let data = new MessageData(
      MessageIcon.PRIMARY,
      MessageColor.PRIMARY,
      message,
    );
    this.open(data);
  }

  info(message: string) {
    let data = new MessageData(
      MessageIcon.ACCENT,
      MessageColor.ACCENT,
      message,
    );
    this.open(data);
  }

  warn(message: string) {
    let data = new MessageData(
      MessageIcon.WARN,
      MessageColor.WARN,
      message,
    );
    this.open(data);
  }

  private open(data: MessageData) {
    this.snackBar.openFromComponent(MessageComponent, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2500,
      data: data,
    });
  }

}
