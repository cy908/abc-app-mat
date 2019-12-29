import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

import { MessageData } from './message-model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: MessageData,
  ) { }

  ngOnInit() {
  }

}
