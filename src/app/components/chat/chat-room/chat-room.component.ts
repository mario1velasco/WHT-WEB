import {  ActivatedRoute,  Router} from '@angular/router';
import {  Component,  OnInit} from '@angular/core';
import {  NgForm} from '@angular/forms';

import { ChatService } from './../../../shared/services/chat.service';
import { SessionService } from './../../../shared/services/session.service';
import {  Message} from './../../../shared/models/message.model';
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

  message: Message = new Message();
  previousComments: Array < Message > = [];
  id = '';
  texto = '';
  lengua = '';

  constructor(
    private chatservice: ChatService,
    private routes: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.user = this.sessionService.getUser();
    // this.chat.originalText = '';
    this.routes
      .params.subscribe(params => {
        this.id = params['id'];
      });

    this.chatservice.joinChatRoom(this.id);

    // this.previousComments = this.chatservice.socket.on('previousComments', comments => {
    //   this.previousComments = comments;
    //   this.render(comments);
    // });

    this.chatservice.socket.on('comment:added', (comment) => {
      console.log('AÑADIDO comentario');
      console.log(comment);
      this.render(comment);
    });
  }
  onSubmitCreateForm(form: NgForm) {
    this.chat.createdBy = this.user.username;
    this.chat.groupName = this.id;
    // this.chat.text = this.texto;
    this.chat.language = this.user.language;
    const now = moment().format('LLLL');
    this.chat.time = now;
    console.log('Mandar Chat = ');
    console.log(this.chat);

    this.chatservice.socket.emit('addComment', this.chat);
  }

  disconnect() {
    console.log('Disconnect.');
    this.chatservice.socket.disconnect();
    this.router.navigate(['/chats']);
  }

  render(data) {
    const html = data.map(function (chat, index) {
      return (`<div>
                <strong>${chat.createdBy}</strong>:
                <em>${chat.text}</em>
              </div>`);
    }).join(' ');
    const d1 = document.getElementById('messages');
    d1.insertAdjacentHTML('beforeend', html);
  }
}
