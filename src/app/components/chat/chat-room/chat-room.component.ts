import { UsersService } from './../../../shared/services/users.service';
import {  ActivatedRoute,  Router} from '@angular/router';
import {  Component,  OnInit} from '@angular/core';
import {  NgForm} from '@angular/forms';

import { ChatService } from './../../../shared/services/chat.service';
import { SessionService } from './../../../shared/services/session.service';
import { Chat } from './../../../shared/models/chat.model';
import { User } from '../../../shared/models/user.model';

import * as moment from 'moment';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {
  user: User = new User();
  chat: Chat = new Chat();
  mnsToSend: string;
  users: Array<User> = [];
  apiError: object;

  groupName = '';
  texto = '';
  lengua = '';

  constructor(
    private chatservice: ChatService,
    private routes: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.routes
      .params.subscribe(params => {
        this.groupName = params['groupName'];
      });

    this.user = this.sessionService.getUser();

    this.chatservice.get(this.user.id, this.groupName).subscribe(
      chat => {
        this.chat = chat[0];
      });

    this.usersService.show().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.log(error);
        this.apiError = error;
      }
    );
    // this.chat.originalText = '';

    this.chatservice.joinChatRoom(this.groupName, this.user);

    this.chatservice.socket.on('previousMessages', comments => {

      this.render(comments);
    });

    this.chatservice.socket.on('comment:added', (comment) => {
      console.log('AÑADIDO comentario');
      console.log(comment);
      this.render(comment.message);
    });
  }
  onSubmitSendMessage(form: NgForm) {
    const now = moment().format('MMMM Do YYYY, HH:mm:ss X');
    const message = {
      chatCreatedBy: this.chat.createdBy,
      groupName: this.groupName,
      createdBy: this.user.id,
      firstLanguage: this.user.language,
      firstText: this.mnsToSend,
      secondLanguage: this.chat.secondLanguage,
      time: now
    };
    console.log('Mandar Mensaje = ');
    console.log(message);

    this.chatservice.socket.emit('addComment', message);
  }

  disconnect() {
    console.log('Disconnect.');
    this.chatservice.socket.disconnect();
    this.router.navigate(['/chats']);
  }

  render(data) {
    const html = [data].map(function (message, index) {
      return (`<div>
                <strong>${message.createdBy}</strong>:
                <em>${message.secondText}</em>
              </div>`);
    }).join(' ');
    const d1 = document.getElementById('messages');
    d1.insertAdjacentHTML('beforeend', html);
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

  getLanguages() {}
}
