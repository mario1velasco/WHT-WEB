import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { BaseApiService } from './base-api.service';
import { environment } from './../../../environments/environment';
import { User } from './../models/user.model';
import { Observable, Subject } from 'rxjs/Rx';

const CURRENT_USER_KEY = 'currentUser';

@Injectable()
export class SessionService extends BaseApiService {
  private static readonly SESSION_API = `${BaseApiService.BASE_API}/session`;

  private user: User;
  private userSubject: Subject<User> = new Subject();

  constructor(private http: Http) {
    super();
    this.user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    this.notifyUserChanges();
  }

  authenticate(user: User): Observable<User> {
    return this.http.post(SessionService.SESSION_API, JSON.stringify(user), BaseApiService.defaultOptions)
      .map(res => {
        return this.doAuthentication(res.json());
      })
      .catch(error => this.handleError(error));
  }

  logout(): Observable<void> {
    return this.http.delete(SessionService.SESSION_API, BaseApiService.defaultOptions)
      .map(res => {
        return this.doLogout();
      })
      .catch(error => this.handleError(error));
  }

  isAuthenticated(): boolean {
    return this.user ? true : false;
  }

  getUser(): User {
    return this.user;
  }

  onUserChanges(): Observable<User> {
    return this.userSubject.asObservable();
  }

  private doAuthentication(user: User): User {
    this.user = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(this.user));
    this.notifyUserChanges();
    return this.user;
  }

  private doLogout(): void {
    this.user = null;
    localStorage.removeItem(CURRENT_USER_KEY);
    this.notifyUserChanges();
  }

  private notifyUserChanges() {
    this.userSubject.next(this.user);
  }

}

