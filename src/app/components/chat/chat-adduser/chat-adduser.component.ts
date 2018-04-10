import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

import { UsersService } from './../../../shared/services/users.service';
import { ChatService } from './../../../shared/services/chat.service';
import { User } from './../../../shared/models/user.model';
import { Chat } from './../../../shared/models/chat.model';

@Component({
  selector: 'app-chat-adduser',
  templateUrl: './chat-adduser.component.html',
  styleUrls: ['./chat-adduser.component.css']
})
export class ChatAdduserComponent implements OnInit {
  @Input() user: User = new User();
  @Input() chat: Chat = new Chat();
  users: Array<User> = [];
  groupName = '';
  apiError: object;

  constructor(
    private chatservice: ChatService,
    private routes: ActivatedRoute,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.routes
      .params.subscribe(params => {
        this.groupName = params['groupName'];
      });

    // this.chatservice.get(this.user.id, this.groupName).subscribe(
    //   chat => {
    //     this.chat = chat[0];
    //     console.log(this.chat);
    //   });

    this.usersService.show().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.log(error);
        this.apiError = error;
      }
    );
  }

  addUserToChat(userId, language) {
    const data = {
      userToAdd: userId,
      groupName: this.groupName,
      secondLanguage: language
    };
    this.chatservice.addUser(this.user, data).subscribe(
      (chat) => {
        console.log(chat);
      },
      (error) => {
        console.log(error);
        this.apiError = error;
      }
    );
  }
}
