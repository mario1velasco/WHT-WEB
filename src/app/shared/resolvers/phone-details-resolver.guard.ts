import { PhonesService } from './../services/phones.service';
import { Observable } from 'rxjs/Rx';
import { Phone } from './../model/phone.model';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable()
export class PhoneDetailsResolverGuard implements Resolve<Phone> {

  constructor(
    private router: Router,
    private phonesService: PhonesService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Phone> {
    return this.phonesService
      .get(route.params['id'])
      .catch(error => {
        this.router.navigate(['/phones']);
        return Observable.of(error);
      });
  }
}
