import {  ActivatedRoute,  Router} from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {  NgForm} from '@angular/forms';

import { UsersService } from './../../../shared/services/users.service';
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
export class ChatRoomComponent implements OnInit, OnDestroy {
  user: User = new User();
  chat: Chat = new Chat();
  mnsToSend: string;
  // users: Array<User> = [];
  apiError: object;
  groupName = '';


  constructor(
    private chatservice: ChatService,
    private routes: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService
    // private usersService: UsersService
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
        console.log(this.chat);
      });

    this.chatservice.joinChatRoom(this.groupName, this.user);

    this.chatservice.socket.on('previousMessages', (comments) => {
      console.log('PREVIOUS MESSAGES');
      console.log(comments);
      this.render(comments);
    });

    this.chatservice.socket.on('comment:added', (comment) => {
      console.log('AÑADIDO comentario');
      console.log(comment);
      this.render(comment.message);
    });
  }

  ngOnDestroy() {
    console.log('Disconnect.');
    this.chatservice.leaveChatRoom(this.groupName);
    // this.chatservice.socket.disconnect();
  }

  disconnect() {
    // console.log('Disconnect.');
    // this.chatservice.socket.disconnect();
    this.router.navigate(['/chats']);
  }

  onSubmitSendMessage(form: NgForm) {
    // const now = moment().format('MMMM Do YYYY, HH:mm:ss X');
    const now = moment().format('YYYY:MM:DDTHH:mm:ss.SSS');
    const language = (this.user.id !== this.chat.createdBy) ? this.chat.firstLanguage : this.chat.secondLanguage;
    const message = {
      chatCreatedBy: this.chat.createdBy,
      groupName: this.groupName,
      createdBy: this.user.id,
      firstLanguage: this.user.language,
      firstText: this.mnsToSend,
      secondLanguage: language,
      time: now
    };
    console.log('Mandar Mensaje = ');
    console.log(message);

    this.chatservice.socket.emit('addComment', message);
  }

  render(data) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    const html = data.map((mns, index) => {
      const text = (mns.createdBy === this.user.id) ? mns.firstText : mns.secondText;
      return (`<div>
                <strong>${mns.createdBy}</strong>:
                <em>${text}</em>
              </div>`);
    }).join(' ');
    const d1 = document.getElementById('messages');
    d1.insertAdjacentHTML('beforeend', html);
  }
}
