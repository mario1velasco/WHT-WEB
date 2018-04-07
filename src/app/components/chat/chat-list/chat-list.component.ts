import { SessionService } from './../../../shared/services/session.service';
import { Message } from './../../../shared/models/message.model';
import { ChatService } from './../../../shared/services/chat.service';
import { GlobalErrorHandlerService } from './../../../shared/services/global-error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  messages: Array<Message>;
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
    console.log(this.user.id);
    this.chatService.get(this.user.id).subscribe(
      (messages) => {
        this.messages = messages;
        console.log('messages');
        console.log(messages);
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

}
