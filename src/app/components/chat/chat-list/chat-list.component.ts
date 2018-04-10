import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnChanges } from '@angular/core';

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
export class ChatListComponent implements OnInit, OnChanges {
  loadSelectedChat = false;
  loadCreateNewChat = false;
  chatsGroups: Array<Chat>;
  chat: Chat = new Chat();
  apiError: object;
  user: User;
  grpName: string;

  constructor(
    private routes: ActivatedRoute,
    private router: Router,
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

  loadChatRoomComponent(grpName) {
    this.grpName = grpName;
    this.loadSelectedChat = true;
  }

  unloadChatRoomComponent(bole: boolean) {
    this.loadSelectedChat = bole;
  }

  loadCreateNewChatComponent() {
    this.loadCreateNewChat = true;
  }

  unloadNewChatComponent(bole: boolean) {
    this.loadCreateNewChat = bole;
  }

}
