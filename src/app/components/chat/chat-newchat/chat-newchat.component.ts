import { NgForm } from '@angular/forms';
import { Chat } from './../../../shared/models/chat.model';
import { User } from './../../../shared/models/user.model';
import { ChatService } from './../../../shared/services/chat.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-chat-newchat',
  templateUrl: './chat-newchat.component.html',
  styleUrls: ['./chat-newchat.component.css']
})
export class ChatNewchatComponent implements OnInit {
  @Output() onCreateChat: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  @Input() user: User = new User();
  apiError: object;
  chat: Chat = new Chat();

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit() {
  }

  // disconnect() {
  //   this.onCreateChat.emit(false);
  // }

  onSubmitCreate(form: NgForm) {
    this.chat.firstLanguage = this.user.language;
    const now = moment().format('LLLL');
    this.chat.time = now;
    console.log('CHAT');
    console.log(this.chat);
    this.chatService.create(this.user.id, this.chat).subscribe(
      (chat) => {
        console.log('Chat Created');
        console.log(chat);
        this.onCreateChat.emit(false);
      },
      (error) => {
        console.log(error);
        this.apiError = error;
      }
    );
  }
}
