import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BaseApiService } from './base-api.service';
import { environment } from './../../../environments/environment';
import { Message } from './../models/message.model';
// import { Message } from './../models/message.model';
import * as io from 'socket.io-client';
import { User } from '../models/user.model';

@Injectable()
export class MessageService extends BaseApiService {
  private static readonly MESSAGE_API = `${BaseApiService.BASE_API}/users`;
  socket = io.connect('http://localhost:3000', { 'forceNew': true });
  // socket = io(environment.baseApi);
  constructor (private http: Http) {
    super();
  }

  get(id: string, groupname: string): Observable<Message> {
    return this.http.get(`${MessageService.MESSAGE_API}/${id}/messages/${groupname}`, MessageService.defaultOptions)
      .map((res: Response) => res.json())
      .catch((error: Response) => this.handleError(error));
  }
}
