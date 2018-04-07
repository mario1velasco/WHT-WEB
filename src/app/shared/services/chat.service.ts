import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BaseApiService } from './base-api.service';
import { Message } from './../models/message.model';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService extends BaseApiService {
  private static readonly CHATS_API = `${BaseApiService.BASE_API}/users`;
  socket = io.connect('http://localhost:3000', { 'forceNew': true });
  // socket = io(environment.baseApi);
  constructor (private http: Http) {
    super();
  }

  get(id: string): Observable<Array<Message>> {
    return this.http.get(`${ChatService.CHATS_API}/${id}/chats`, ChatService.defaultOptions)
      .map((res: Response) => res.json())
      .catch((error: Response) => this.handleError(error));
  }


  /*SHOCKET.IO FUNCTIONS*/

  addComment (data) {
    this.socket.emit('addComment', data);
  }

  joinChatRoom (showId) {
    console.log('Chat Room = show id =' + showId);

    this.socket.emit('join', `show-id-${showId}`);
  }

  onJoinChatRoom () {
    return new Promise((resolve, reject) => {
      this.socket.on('room:joined', (data) => {
        resolve(data);
      });
    });
  }
}
