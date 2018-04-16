import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from './../../../shared/models/user.model';
import { SessionService } from './../../../shared/services/session.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit, OnDestroy {
  user: User;
  userSubscription: Subscription;

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    // window.location.reload();
    this.user = this.sessionService.getUser();
    this.userSubscription = this.sessionService.onUserChanges()
      .subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    // window.location.reload();
  }

  onClickLogout() {
    this.sessionService.logout()
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }
}
