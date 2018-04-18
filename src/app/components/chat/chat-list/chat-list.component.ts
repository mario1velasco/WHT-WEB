import { ChatRoomComponent } from './../chat-room/chat-room.component';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { SessionService } from './../../../shared/services/session.service';
import { MessageService } from './../../../shared/services/message.service';
import { ChatService } from './../../../shared/services/chat.service';
import { GlobalErrorHandlerService } from './../../../shared/services/global-error-handler.service';
import { User } from '../../../shared/models/user.model';
import { Chat } from './../../../shared/models/chat.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit, OnDestroy{
  @ViewChild(ChatRoomComponent) chatRoomComponent: ChatRoomComponent;
  loadSelectedChat = false;
  loadCreateNewChat = false;
  chatsGroups: Array<Chat>;
  chat: Chat = new Chat();
  apiError: object;
  user: User;
  grpName: string;
  rerender = false;

  constructor(
    private globalErrorHandlerService: GlobalErrorHandlerService,
    private chatService: ChatService,
    private sessionService: SessionService,
    private messageService: MessageService,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    this.chatService.connect();
    console.log(this.user);
    this.user = this.sessionService.getUser();
    console.log(this.user);
    this.loadChatGroups();

    this.chatService.socket.on('notifymessage', (comment) => {
      console.log('MENSAJE RECIBIDO');
      this.renderAddBadge(comment.message.groupName);
    });

    this.chatService.socket.on('updateChatList:SendFromServer', (data) => {
      console.log('updateChatList:SendFromServer');
      console.log(data);
      console.log(this.user.id);
      if (this.user.id === data.id) {
        const html = `<a href="javascript:;" class="collection-item"
        (click)="loadChatRoomComponent(${data.groupName})" id="badge${data.groupName}">
        <span class="new badge"></span>
        ${data.groupName}
      </a>`;
        const d1 = document.getElementById('collectionChats');
        d1.insertAdjacentHTML('beforeend', html);
        this.elRef.nativeElement.querySelector('#badge' + data.groupName).addEventListener('click', () => {
          this.loadChatRoomComponent(data.groupName);
        });
        // this.loadChatRoomComponent(data.groupName).bind(this));
      }
    });

    this.chatService.socket.on('notifyDeleteChat:SendFromServer', (comment) => {
    //   this.chatService.connect();
    // console.log(this.user);
    // this.user = this.sessionService.getUser();
    // console.log(this.user);
    // this.loadChatGroups();
      console.log('notifyDeleteChat:SendFromServer');
      this.loadSelectedChat = false;
      this.doRerender();
    });
  }



  ngOnDestroy() {
    console.log('onDestroy Chat list');
    this.chatService.socket.emit('disconnect');
    // this.chatService.socket.disconnect();
    // this.chatService.socket.close();
    // window.location.reload();
  }

  paintNotifications() {
    this.sleep(1000).then(() => {
      this.chatsGroups.forEach(chat => {
        this.messageService.get(this.user.id, chat.groupName).subscribe(bool => {
          console.log(bool);
          if (!bool.wasRead) {
            this.renderAddBadge(chat.groupName);
          }
        },
        (error) => {
          console.log('error wasRead');
          this.globalErrorHandlerService.handleError(error);
        });
      });
  });
 }

  notifyReadMessage(grpName: string) {
    console.log('NOTIIFY NOTIFY');
    const d1 = document.getElementById('badge' + grpName);
    console.log(d1);
    d1.innerHTML = '';
    d1.insertAdjacentHTML('beforeend', `${grpName}`);
  }

  renderAddBadge(grpName: string) {
    const html = (`<span class="new badge" id="spnBadge${grpName}">4</span>${grpName}`);
    const d1 = document.getElementById('badge' + grpName);
    d1.innerHTML = '';
    d1.insertAdjacentHTML('beforeend', html);
  }

  loadChatRoomComponent(grpName: string) {
    const d1 = document.getElementById('badge' + grpName);
    d1.innerHTML = '';
    d1.insertAdjacentHTML('beforeend', `${grpName}`);
    this.grpName = grpName;
    this.loadSelectedChat = true;
    this.loadCreateNewChat = false;
  }

  unloadChatRoomComponent(bole: boolean) {
    this.loadSelectedChat = bole;
    this.doRerender();
  }

  loadCreateNewChatComponent() {
    this.loadCreateNewChat = true;
    this.loadSelectedChat = false;
  }

  unloadNewChatComponent(bole: boolean) {
    this.loadCreateNewChat = bole;
    this.doRerender();
  }

  doRerender() {
    this.loadChatGroups();
  }

  loadChatGroups() {
    this.rerender = true;
    this.chatService.show(this.user.id).subscribe(
      (messages) => {
        this.chatsGroups = messages;
        this.rerender = false;
        this.paintNotifications();
      },
      (error) => {
        console.log('error');
        this.globalErrorHandlerService.handleError(error);
        window.alert(error);
        // this.apiError = error;
      }
    );
  }

  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
