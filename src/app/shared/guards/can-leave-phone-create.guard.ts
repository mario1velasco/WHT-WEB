import { PhoneCreateComponent } from './../../components/phone/phone-create/phone-create.component';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CanLeavePhoneCreateGuard implements CanDeactivate<PhoneCreateComponent> {

  canDeactivate(component: PhoneCreateComponent): Observable<boolean> | Promise<boolean> | boolean {
    return component.canLeaveTheComponent();
  }
}
