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
import { debug } from 'util';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, OnDestroy, OnChanges {
  @Input() grpName: string;
  @Output() disconnectRoom: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  @Output() readMessage: EventEmitter<String> = new EventEmitter<String>();
  user: User = new User();
  secondChatUser: User = new User();
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
    private sessionService: SessionService,
    private usersService: UsersService
    // private usersService: UsersService
  ) { }

  ngOnInit() {
    // this.user = this.sessionService.getUser();
  }

  ngOnChanges() {
    this.user = this.sessionService.getUser();

    this.chatservice.get(this.user.id, this.grpName).subscribe(
      chat => {
        this.chat = chat[0];
        console.log('onchanges');
        console.log(this.chat);
        for (const usr of this.chat.users) {
          if (usr !== this.user.id) {
            this.usersService.get(usr).subscribe((sndChatUser) => {
              this.secondChatUser = sndChatUser;
            });
          }
        }
      });

    this.chatservice.joinChatRoom(this.grpName, this.user);

    this.chatservice.socket.on('previousMessages', (messages) => {
      this.previousMessages = messages;
        if ((messages[0].createdBy === 'WHT? Group') && (messages.length === 1)) {
          this.render(messages, true);
        } else {
          console.log('PREVIOUS MESSAGES');
          console.log(messages);
          document.getElementById('messages').innerHTML = '';
          this.render(messages, true);
        }
    });

    this.chatservice.socket.on('updateChatList:SendFromServer', (data) => {
      this.usersService.get(data.id).subscribe((sndChatUser) => {
        this.secondChatUser = sndChatUser;
      });
    });

    this.chatservice.socket.on('comment:added', (comment) => {
      console.log('AÑADIDO comentario');
      console.log(comment);
      this.render(comment.message, false);
      if (comment.message.createdBy !== this.user.id ) {
        this.chatservice.socket.emit('messageRead', comment.message);
        this.readMessage.emit(this.chat.groupName);
      }
    });

  }

  ngOnDestroy() {
    this.chatservice.leaveChatRoom(this.grpName);
  }

  disconnect() {
    console.log('Disconnect');
    this.chatservice.leaveChatRoom(this.grpName);
    this.disconnectRoom.emit(false);
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

  loadAddUserComponent() {
    this.loadAddUser = true;
  }
  unloadAddUserComponent(id: string) {
    this.loadAddUser = false;
    const data = {id: id, groupName: this.grpName};
    this.chatservice.socket.emit('updateChatList:SendFromClient', data);
  }

  leaveChat() {
    console.log(this.user.id);
    this.chatservice.leaveChat(this.user.id, this.grpName).subscribe(
      user => {
        console.log('USER LEAVE CHAT');
        this.disconnectRoom.emit(false);
      });
  }

  deleteChat() {
    this.chatservice.deleteChat(this.user.id, this.grpName).subscribe(
      user => {
        console.log('CHAT DELETED');
        this.disconnectRoom.emit(false);
      });
  }

  render(data, isPreviousMns: boolean) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    const html = data.map((mns, index) => {
      // if ((mns.chatCreatedBy === this.user.id) || (this.user.id === mns.createdBy)) {
        const text = (this.user.id === mns.createdBy) ? mns.firstText : mns.secondText;
        if (mns.wasRead) {
          if (mns.createdBy === 'WHT? Group') {
            return (`<div>
            <strong>${mns.createdBy}</strong>:
            <em>${text}</em>
            </div>`);
          } else if (this.user.id === mns.createdBy) {
            return (`<div>
            <strong>${this.user.username}</strong>:
            <em>${text}</em>
            </div>`);
          } else {
            return (`<div>
            <strong>${this.secondChatUser.username}</strong>:
            <em>${text}</em>
            </div>`);
          }
        } else if (this.user.id === mns.createdBy) {
          return (`<div>
          <strong>${this.user.username}</strong>:
          <em>${text}</em>
          </div>`);
        } else if (!isPreviousMns) {
          if (this.user.id === mns.createdBy) {
            return (`<div>
            <strong>${this.user.username}</strong>:
            <em>${text}</em>
            </div>`);
          } else {
            return (`<div>
            <strong>${this.secondChatUser.username}</strong>:
            <em>${text}</em>
            </div>`);
          }
        } else {
          if (this.user.id === mns.createdBy) {
            return (`<div>
            <strong>${this.user.username}(unread)</strong>:
            <em>${text}</em>
            </div>`);
          } else {
            return (`<div>
            <strong>${this.secondChatUser.username}(unread)</strong>:
            <em>${text}</em>
            </div>`);
          }
        }
      // }
      // return (``);
    }).join(' ');
    const d1 = document.getElementById('messages');
    d1.insertAdjacentHTML('beforeend', html);
  }
}
