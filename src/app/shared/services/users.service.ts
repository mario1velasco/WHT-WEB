import { BaseApiService } from './base-api.service';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { User } from './../models/user.model';

@Injectable()
export class UsersService extends BaseApiService {
  private static readonly USERS_API = `${BaseApiService.BASE_API}/users`;

  constructor(private http: Http) {
    super();
  }

  create(user: User): Observable<User> {
    return this.http.post(UsersService.USERS_API, JSON.stringify(user), UsersService.defaultOptions)
      .map((res: Response) => res.json())
      .catch((error: Response) => this.handleError(error));
  }

  get(id: string): Observable<User> {
    return this.http.get(`${UsersService.USERS_API}/${id}`, UsersService.defaultOptions)
      .map((res: Response) => res.json())
      .catch((error: Response) => this.handleError(error));
  }

  show(): Observable<Array<User>> {
    return this.http.get(`${UsersService.USERS_API}`, UsersService.defaultOptions)
      .map((res: Response) => res.json())
      .catch((error: Response) => this.handleError(error));
  }

  edit(user: User): Observable<User> {
    return this.http.put(`${UsersService.USERS_API}/${user.id}`, JSON.stringify(user), UsersService.defaultOptions)
      .map((res: Response) => res.json())
      .catch(error => this.handleError(error));
  }
}
