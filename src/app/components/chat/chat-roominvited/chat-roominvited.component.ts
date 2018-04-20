import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ChatService } from './../../../shared/services/chat.service';
import { SessionService } from './../../../shared/services/session.service';
import { Chat } from './../../../shared/models/chat.model';
import { User } from '../../../shared/models/user.model';

import * as moment from 'moment';

@Component({
  selector: 'app-chat-roominvited',
  templateUrl: './chat-roominvited.component.html',
  styleUrls: ['./chat-roominvited.component.css']
})
export class ChatRoominvitedComponent implements OnInit, OnDestroy {
  user: User = new User();
  chat: Chat = new Chat();
  mnsToSend: string;
  grpName: string;
  language = '';
  apiError: object;
  rerender = false;
  isInvited = true;
  loadAddUser = false;
  previousMessages: object;

  constructor(
    private chatService: ChatService,
    private routes: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.chatService.connect();
    this.routes.params.subscribe((params) => {
      const id = params['id'];
      this.user.id = id;
      this.grpName = params['groupName'];
      console.log(this.grpName);
      console.log(this.user);
    });
    // this.user = this.sessionService.getUser();

    // BUSCAR POR ID DE INVITED USERNAME
    this.chatService.get(this.user.id, this.grpName).subscribe(
      chat => {
        this.chat = chat[0];
        this.isInvited = this.chat.isInvited;
        console.log('IS INVITED');
        console.log(this.isInvited);
      });

    this.chatService.joinChatRoom(this.grpName, this.user);

    this.chatService.socket.on('comment:added', (comment) => {
      console.log('AÑADIDO comentario');
      console.log(comment);
      this.render(comment.message);
    });
  }

  ngOnDestroy() {
    console.log('Leaving room....');
    this.chatService.leaveChatRoom(this.grpName);
    // this.chatService.socket.disconnect();
  }

  disconnect() {
    // console.log('Disconnect.');
    // this.chatService.socket.disconnect();
    this.chatService.leaveChatRoom(this.grpName);
  }

  onSubmitSendMessage(form: NgForm) {
    // const now = moment().format('MMMM Do YYYY, HH:mm:ss X');
    const now = moment().format('YYYY:MM:DDTHH:mm:ss.SSS');
    const lang = (this.user.id !== this.chat.createdBy) ? this.chat.firstLanguage : this.chat.secondLanguage;
    const message = {
      chatCreatedBy: this.chat.createdBy,
      groupName: this.grpName,
      createdBy: this.user.id,
      firstLanguage: this.language,
      firstText: this.mnsToSend,
      secondLanguage: this.chat.firstLanguage,
      time: now,
      isInvited: true
    };
    console.log('Mandar Mensaje = ');
    console.log(message);
    this.chatService.socket.emit('addComment', message);
    this.mnsToSend = '';
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

  loadAddUserComponent() {
    this.loadAddUser = true;
  }
  unloadAddUserComponent(boole) {
    this.loadAddUser = boole;
    // this.rerender = true;
    this.chatService.get(this.user.id, this.grpName).subscribe(
      chat => {
        this.chat = chat[0];
        console.log(this.chat);
        document.getElementById('messages').innerHTML = '';
        this.render(this.previousMessages);
      });
  }

}
