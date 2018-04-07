import {  ActivatedRoute,  Router} from '@angular/router';
import {  ChatService} from './../../../shared/services/chat.service';
import {  Message} from './../../../shared/models/message.model';
import {  Component,  OnInit} from '@angular/core';
import {  NgForm} from '@angular/forms';

import * as moment from 'moment';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {
  message: Message = new Message();
  previousComments: Array < Message > = [];
  id: String = '';
  user: String = '';
  texto: String = '';
  lengua: String = '';

  constructor(
    private chat: ChatService,
    private routes: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.routes
      .params.subscribe(params => {
        this.id = params['id'];
      });

    // this.chat.joinChatRoom(this.id);
    this.chat.joinChatRoom("asd23543rewr4et");

    // this.previousComments = this.chat.socket.on('previousComments', comments => {
    //   this.previousComments = comments;
    //   this.render(comments);
    // });

    this.chat.socket.on('comment:added', (comment) => {
      console.log('AÑADIDO comentario');
      console.log(comment);
      this.render(comment);
    });
  }
  onSubmitCreateForm(form: NgForm) {
    this.message.created_by = this.user;
    this.message.text = this.texto;
    this.message.lenguage = this.lengua;
    const now = moment().format('LLLL');
    this.message.date = now;
    console.log('Mandar message = ');
    console.log(this.message);

    this.chat.socket.emit('addComment', this.message);
  }

  disconnect() {
    console.log('Disconnect.');
    this.chat.socket.disconnect();
    this.router.navigate(['/chats']);
  }

  render(data) {
    const html = data.map(function (mess, index) {
      return (`<div>
                <strong>${mess.username}</strong>:
                <em>${mess.text}</em>
              </div>`);
    }).join(' ');
    const d1 = document.getElementById('messages');
    d1.insertAdjacentHTML('beforeend', html);
  }
}
