import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable   } from 'rxjs';

import { SessionService } from './../../../shared/services/session.service';
import { User } from './../../../shared/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private user: User = new User();
  // private userSubscription: Subscription;

  constructor(
    private router: Router,
    private sessionService: SessionService) { }

    ngOnInit() {
      this.user = this.sessionService.getUser();
      // this.userSubscription = this.sessionService.onUserChanges()
      //   .subscribe(user => this.user = user);
    }

    ngOnDestroy() {
      // this.userSubscription.unsubscribe();
    }

    onClickLogout() {
      this.sessionService.logout()
        .subscribe(() => {
          this.router.navigate(['/login']);
        });
    }
}
