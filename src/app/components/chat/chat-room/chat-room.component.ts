import { MaterializeAction } from 'angular2-materialize';
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
  @Output() disconnectRoom: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  @Output() readMessage: EventEmitter<String> = new EventEmitter<String>();
  modalActions = new EventEmitter<string|MaterializeAction>();
  user: User = new User();
  secondChatUser: User;
  chat: Chat = new Chat();
  mnsToSend: string;
  // users: Array<User> = [];
  apiError: object;
  rerender = false;
  justOne = true;
  loadAddUser = false;
  previousMessages: object;


  constructor(
    private chatService: ChatService,
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
    // this.chatService.connect();
    console.log('onchanges');
    this.user = this.sessionService.getUser();

    this.chatService.get(this.user.id, this.grpName).subscribe(
      chat => {
        // debugger
        this.chat = chat[0];
        console.log(this.chat);
        for (const usr of this.chat.users) {
          if (usr !== this.user.id) {
            this.usersService.get(usr).subscribe((sndChatUser) => {
              this.secondChatUser = sndChatUser;
            });
          }
        }
      });

    this.chatService.joinChatRoom(this.grpName, this.user);

    this.chatService.socket.on('previousMessages', (messages, chat, sndChatUser) => {
      this.chat = chat[0];
      console.log(this.chat);
      this.secondChatUser = sndChatUser;
      this.previousMessages = messages;
      // debugger
      if ((messages[0].createdBy === 'WHT? Group') && (messages.length === 1)) {
        document.getElementById('messages').innerHTML = '';
        this.render(messages, true);
      } else {
        console.log('PREVIOUS MESSAGES');
        console.log(messages);
        document.getElementById('messages').innerHTML = '';
        this.render(messages, true);
      }
    });

    this.chatService.socket.on('updateChatList:SendFromServer', (data) => {
      this.usersService.get(data.id).subscribe((sndChatUser) => {
        this.secondChatUser = sndChatUser;
        this.chat.secondLanguage = this.secondChatUser.language;
      });
    });

    this.chatService.socket.on('comment:added', (comment) => {
      if (this.justOne) {
        this.justOne = false;
        setTimeout(() => {
          console.log('AÑADIDO comentario');
          console.log(comment);
          this.render(comment.message, false);
          if (comment.message.createdBy !== this.user.id ) {
            this.chatService.socket.emit('messageRead', comment.message);
            this.readMessage.emit(this.chat.groupName);
          }
          this.justOne = true;
        }, 200);
      }
    });

  }

  ngOnDestroy() {
    this.chatService.leaveChatRoom(this.grpName);
  }

  disconnect() {
    console.log('Disconnect');
    this.chatService.leaveChatRoom(this.grpName);
    this.disconnectRoom.emit(false);
  }


  onSubmitSendMessage(form: NgForm) {
    // this.chatService.connect();
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

    this.chatService.socket.emit('addComment', message);
    this.mnsToSend = '';
  }

  loadAddUserComponent() {
    this.loadAddUser = true;
  }
  unloadAddUserComponent(id: string) {
    this.loadAddUser = false;
    const data = {id: id, groupName: this.grpName};
    this.chatService.socket.emit('updateChatList:SendFromClient', data);
  }

  leaveChat() {
    console.log(this.user.id);
    this.chatService.leaveChat(this.user.id, this.grpName).subscribe(
      user => {
        console.log('USER LEAVE CHAT');
        this.disconnectRoom.emit(false);
      });
  }

  deleteChat() {
    this.chatService.deleteChat(this.user.id, this.grpName).subscribe(
      user => {
        console.log('CHAT DELETED');
        this.chatService.notifyDeleteChat(this.grpName);
        this.disconnectRoom.emit(false);
      });
  }

  copyLink() {
      /* Get the text field */
      // (<HTMLInputElement>document.getElementById('linkToCopy')).value;
    // const copyText = (<HTMLInputElement>document.getElementById('linkToCopy'));
    // // const copyText = <HTMLInputElement>document.querySelector('linkToCopy');

    // /* Select the text field */
    // copyText.select();

    // /* Copy the text inside the text field */
    // document.execCommand('Copy');

    // /* Alert the copied text */
    // alert(copyText.value);
  }

  openModal() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }
  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  render(data, isPreviousMns: boolean) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    const html = data.map((mns, index) => {
      // debugger
      const text = (this.user.id === mns.createdBy) ? mns.firstText : mns.secondText;
      if (mns.createdBy === 'WHT? Group') {
        return (`<div>
        <strong>${mns.createdBy}</strong>:
        <em>${text}</em>
        </div>`);
      } else if (mns.wasRead) {
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

  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
