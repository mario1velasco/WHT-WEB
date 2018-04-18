import { UsersService } from './../../../shared/services/users.service';
import { SessionService } from './../../../shared/services/session.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.component.html',
  styleUrls: ['./user-friends.component.css']
})
export class UserFriendsComponent implements OnInit, OnChanges {
  user: User;
  loadAddUser = false;
  friends: Array<User> = new Array<User>();
  rerender = false;

  constructor(
    private sessionService: SessionService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.user = this.sessionService.getUser();
    this.getUserFriends();
    console.log(this.user);
  }

  ngOnChanges() {
    // this.doRender();
  }

  getUserFriends() {
    this.friends.splice(0, this.friends.length);
    for (const friend of this.user.friends) {
      this.usersService.get(friend).subscribe(user => {
        this.friends.push(user);
        console.log('getUserFriends');
        console.log(this.friends);
      });
    }
  }

  friendInfo(user: User) {
    this.user.friends.splice(0, this.user.friends.length);
    this.friends.splice(0, this.friends.length);
    console.log(this.user);
    this.usersService.edit(this.user).subscribe((usr) => {
      this.sessionService.setUser(this.user);
      console.log('Delete ALL Friends');
      console.log(this.user);
    });
  }

  deleteUserAsFriend(user: User) {
    const pos = this.user.friends.indexOf(user.id);
    this.user.friends.splice(pos, 1);
    this.friends = this.friends.filter(item => {
      return item.id !== user.id;
    });
    this.usersService.edit(this.user).subscribe((usr) => {
      this.sessionService.setUser(this.user);
      console.log('Delete Friend = ' + user.username);
    });
  }

  loadAddUserComponent() {
    this.loadAddUser = true;
  }

  unloadAddUserComponent(user: User) {
    this.user = user;
    this.sessionService.setUser(this.user);
    this.loadAddUser = false;
    this.doRender();
  }

  doRender() {
    this.rerender = true;
    this.user = this.sessionService.getUser();
    this.getUserFriends();
    this.rerender = false;
  }


}
