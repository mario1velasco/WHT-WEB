import { UsersService } from './../../../shared/services/users.service';
import { SessionService } from './../../../shared/services/session.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.component.html',
  styleUrls: ['./user-friends.component.css']
})
export class UserFriendsComponent implements OnInit {
  user: User;
  loadAddUser = false;
  friends: Array<User> = new Array<User>();

  constructor(
    private sessionService: SessionService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.user = this.sessionService.getUser();
    this.getUserFriends();
  }
  
  // ngOnChanges() {
  //   this.user = this.sessionService.getUser();
  //   this.getUserFriends();
  // }

  getUserFriends() {
    for (const friend of this.user.friends) {
      this.usersService.get(friend).subscribe(user => {
        this.friends.push(user);
      });
    }
  }

  deleteUserAsFriend(usr: string) {
    const pos = this.user.friends.indexOf(usr);
    this.user.friends.splice(pos, 1);
    this.sessionService.setUser(this.user);
    this.loadAddUser = false;
  }

  loadAddUserComponent() {
    this.loadAddUser = true;
  }

  unloadAddUserComponent(user: User) {
    this.user.friends.push(user.id);
    this.sessionService.setUser(this.user);
    this.loadAddUser = false;
  }
}
