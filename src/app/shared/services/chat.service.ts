import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BaseApiService } from './base-api.service';
import { environment } from './../../../environments/environment';
import { Chat } from './../models/chat.model';
// import { Message } from './../models/message.model';
import * as io from 'socket.io-client';
import { User } from '../models/user.model';

@Injectable()
export class ChatService extends BaseApiService {
  private static readonly CHATS_API = `${BaseApiService.BASE_API}/users`;
  socket = io.connect('http://localhost:3000', { 'forceNew': true });
  // socket = io(environment.baseApi);
  constructor (private http: Http) {
    super();
  }

  show(id: string): Observable<Array<Chat>> {
    return this.http.get(`${ChatService.CHATS_API}/${id}/chats`, ChatService.defaultOptions)
      .map((res: Response) => res.json())
      .catch((error: Response) => this.handleError(error));
  }

  get(id: string, groupname: string): Observable<Chat> {
    return this.http.get(`${ChatService.CHATS_API}/${id}/chats/${groupname}`, ChatService.defaultOptions)
      .map((res: Response) => res.json())
      .catch((error: Response) => this.handleError(error));
  }

  // http://localhost:3000/users/5ac50598dabd0d33a48ceb1d/chats
  create(id: string, chat: Chat): Observable<Chat> {
    return this.http.post(`${ChatService.CHATS_API}/${id}/chats`, JSON.stringify(chat), ChatService.defaultOptions)
      .map((res: Response) => res.json())
      .catch((error: Response) => this.handleError(error));
  }

  addUser(user: User, data: object): Observable<User> {
    return this.http.put(`${ChatService.CHATS_API}/${user.id}/chats/adduser`, JSON.stringify(data), ChatService.defaultOptions)
      .map((res: Response) => res.json())
      .catch(error => this.handleError(error));
  }

  /*SHOCKET.IO FUNCTIONS*/

  addComment (data) {
    this.socket.emit('addComment', data);
  }

  joinChatRoom (roomName: string, user: User) {
    console.log('Chat Room Name = ' + roomName);

    this.socket.emit('join', roomName, user);
  }

  // onJoinChatRoom () {
  //   return new Promise((resolve, reject) => {
  //     this.socket.on('room:joined', (data) => {
  //       resolve(data);
  //     });
  //   });
  // }
}