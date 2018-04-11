import { NgForm } from '@angular/forms';
import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';

import { SessionService } from './../../../shared/services/session.service';
import { ChatService } from './../../../shared/services/chat.service';
import { GlobalErrorHandlerService } from './../../../shared/services/global-error-handler.service';
import { User } from '../../../shared/models/user.model';
import { Chat } from './../../../shared/models/chat.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit, OnChanges, OnDestroy {
  loadSelectedChat = false;
  loadCreateNewChat = false;
  chatsGroups: Array<Chat>;
  chat: Chat = new Chat();
  apiError: object;
  user: User;
  grpName: string;
  rerender = false;

  constructor(
    private globalErrorHandlerService: GlobalErrorHandlerService,
    private chatService: ChatService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.user = this.sessionService.getUser();
    this.chatService.show(this.user.id).subscribe(
      (messages) => {
        this.chatsGroups = messages;
      },
      (error) => {
        console.log('error');
        this.globalErrorHandlerService.handleError(error);
        this.apiError = error;
      }
    );
  }

  ngOnChanges() {}

  ngOnDestroy() {
    this.chatService.disconnect();
  }

  loadChatRoomComponent(grpName) {
    this.grpName = grpName;
    this.loadSelectedChat = true;
    this.loadCreateNewChat = false;
  }

  unloadChatRoomComponent(bole: boolean) {
    this.loadSelectedChat = bole;
  }

  loadCreateNewChatComponent() {
    this.loadCreateNewChat = true;
    this.loadSelectedChat = false;
  }

  unloadNewChatComponent(bole: boolean) {
    this.loadCreateNewChat = bole;
    this.doRerender();
  }

  doRerender() {
    this.rerender = true;
    this.chatService.show(this.user.id).subscribe(
      (messages) => {
        this.chatsGroups = messages;
        this.rerender = false;
      },
      (error) => {
        console.log('error');
        this.globalErrorHandlerService.handleError(error);
        this.apiError = error;
      }
    );
  }

}
