import { SessionService } from './../../../shared/services/session.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.component.html',
  styleUrls: ['./user-friends.component.css']
})
export class UserFriendsComponent implements OnInit {
  user: User;

  constructor(
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.user = this.sessionService.getUser();
  }

}
