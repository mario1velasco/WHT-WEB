import { EventEmitter } from '@angular/core';
import {  ActivatedRoute,  Router} from '@angular/router';
import { Component, OnInit, OnDestroy, Input, OnChanges, Output} from '@angular/core';
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
export class ChatRoomComponent implements OnInit, OnDestroy, OnChanges {
  @Input() grpName: string;
  @Output() onDisconnect: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  user: User = new User();
  chat: Chat = new Chat();
  mnsToSend: string;
  // users: Array<User> = [];
  apiError: object;
  rerender = false;
  loadAddUser = false;
  previousMessages: object;

  constructor(
    private chatservice: ChatService,
    private routes: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService
    // private usersService: UsersService
  ) { }

  ngOnInit() {}

  ngOnChanges() {
    this.user = this.sessionService.getUser();

    this.chatservice.get(this.user.id, this.grpName).subscribe(
      chat => {
        this.chat = chat[0];
        console.log(this.chat);
      });

    this.chatservice.joinChatRoom(this.grpName);

    // this.chatservice.socket.on('previousMessages', (messages) => {
    //   this.previousMessages = messages;
    //   console.log('PREVIOUS MESSAGES');
    //   console.log(messages);
    //   document.getElementById('messages').innerHTML = '';
    //   this.render(messages);
    // });

    this.chatservice.socket.on('comment:added', (comment) => {
      console.log('AÑADIDO comentario');
      console.log(comment);
      this.render(comment.message);
    });
  }

  ngOnDestroy() {
    console.log('Leaving room....');
    this.chatservice.leaveChatRoom(this.grpName);
    // this.chatservice.socket.disconnect();
  }

  disconnect() {
    // console.log('Disconnect.');
    // this.chatservice.socket.disconnect();
    this.chatservice.leaveChatRoom(this.grpName);
    this.onDisconnect.emit(false);
  }

  onSubmitSendMessage(form: NgForm) {
    // const now = moment().format('MMMM Do YYYY, HH:mm:ss X');
    const now = moment().format('YYYY:MM:DDTHH:mm:ss.SSS');
    const language = (this.user.id !== this.chat.createdBy) ? this.chat.firstLanguage : this.chat.secondLanguage;
    const message = {
      chatCreatedBy: this.chat.createdBy,
      groupName: this.grpName,
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
      console.log(mns.chatCreatedBy);
      console.log(this.user.id);
      
      const text = (mns.chatCreatedBy === this.user.id) ? mns.firstText : mns.secondText;
      return (`<div>
      <strong>${mns.chatCreatedBy}</strong>:
      <em>${text}</em>
      </div>`);
    }).join(' ');
    const d1 = document.getElementById('messages');
    d1.insertAdjacentHTML('beforeend', html);
  }

  loadAddUserComponent() {
    this.loadAddUser = true;
  }
  unloadAddUserComponent(boole) {
    this.loadAddUser = boole;
    // this.rerender = true;
    this.chatservice.get(this.user.id, this.grpName).subscribe(
      chat => {
        this.chat = chat[0];
        console.log(this.chat);
        document.getElementById('messages').innerHTML = '';
        this.render(this.previousMessages);
      });
  }
}
