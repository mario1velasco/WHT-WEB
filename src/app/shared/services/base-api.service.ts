import { RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { environment } from './../../../environments/environment';

@Injectable()
export class BaseApiService {
  protected static readonly BASE_API = environment.baseApi;
  protected static defaultHeaders: Headers = new Headers({ 'Content-Type': 'application/json' });
  protected static defaultOptions: RequestOptions = new RequestOptions({
    headers: BaseApiService.defaultHeaders,
    // withCredentials: true
  });

  constructor() {}

  protected handleError(error: Response | any): Observable<any> {
    if (!environment.production) {
      console.error(`${this.constructor.name} error: ${error}`);
    }
    return Observable.throw(error.json());
  }

}
