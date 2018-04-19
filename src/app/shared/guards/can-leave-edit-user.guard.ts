import { UserEditComponent } from './../../components/user/user-edit/user-edit.component';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CanLeaveEditUserGuard implements CanDeactivate<UserEditComponent> {
  canDeactivate(component: UserEditComponent): Observable<boolean> | Promise<boolean> | boolean {
    return component.canLeaveTheComponent();
  }
}
