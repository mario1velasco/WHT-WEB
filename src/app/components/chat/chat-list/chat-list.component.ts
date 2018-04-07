import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { SessionService } from './../../../shared/services/session.service';
import { ChatService } from './../../../shared/services/chat.service';
import { GlobalErrorHandlerService } from './../../../shared/services/global-error-handler.service';
import { Message } from './../../../shared/models/message.model';
import { User } from '../../../shared/models/user.model';
import { Chat } from './../../../shared/models/chat.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  messages: Array<Message>;
  chat: Chat = new Chat();
  apiError: object;
  user: User;

  constructor(
    private routes: ActivatedRoute,
    private router: Router,
    private globalErrorHandlerService: GlobalErrorHandlerService,
    private chatService: ChatService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.user = this.sessionService.getUser();
    this.chatService.get(this.user.id).subscribe(
      (messages) => {
        this.messages = messages;
      },
      (error) => {
        console.log('error');
        this.globalErrorHandlerService.handleError(error);
        this.apiError = error;
      }
    );
    // this.routes.parent.params.subscribe((params) => {
    //   console.log(params);
    //   const id = params['id'];
    //   console.log(id);
    // });
  }

  onSubmitCreate(form: NgForm) {
    this.chatService.create(this.user.id, this.chat).subscribe(
      (user) => {
        this.router.navigate(['/chats']);
      },
      (error) => {
        console.log(error);
        this.apiError = error.message;
      }
    );
  }

}
