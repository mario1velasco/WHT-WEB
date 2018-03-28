import { BaseApiService } from './base-api.service';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { User } from './../models/user.model';

@Injectable()
export class UsersService extends BaseApiService {
  private static readonly USERS_API = `${BaseApiService.BASE_API}/users`;
  // private static readonly BASE_API: string = environment.baseApi;
  // private static readonly USERS_API: string = `${UsersService.BASE_API}/users`;
  // private static defaultHeaders = new Headers({
  //     'Content-Type': 'application/json'
  // });
  // // headers.append('Access-Control-Allow-Origin','*');
  // private static defaultOptions = new RequestOptions({
  //   headers: UsersService.defaultHeaders
  // });


  constructor(private http: Http) {
    super();
  }

  create(user: User): Observable<User> {
    console.log(user);
    console.log(UsersService.USERS_API);
    console.log(UsersService.defaultOptions);

    return this.http.post(UsersService.USERS_API, JSON.stringify(user), UsersService.defaultOptions)
      .map((res: Response) => res.json())
      .catch((error: Response) => this.handleError(error));
  }

  // private handleError(error: Response): Observable<any> {
  //   if (!environment.production) {
  //     console.error(error);
  //   }
  //   return Observable.throw(error.json());
  // }
}
