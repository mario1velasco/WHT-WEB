import { MaterializeAction } from 'angular2-materialize';
import { EventEmitter } from '@angular/core';
import { UsersService } from './../../../shared/services/users.service';
import { SessionService } from './../../../shared/services/session.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.component.html',
  styleUrls: ['./user-friends.component.css']
})
export class UserFriendsComponent implements OnInit {
  modalActions = new EventEmitter<string|MaterializeAction>();
  friends: Array<User> = new Array<User>();
  user: User;
  infoUser: User = new User();
  loadAddUser = false;
  rerender = false;

  constructor(
    private sessionService: SessionService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.user = this.sessionService.getUser();
    this.getUserFriends();
  }

  getUserFriends() {
    this.friends.splice(0, this.friends.length);
    for (const friend of this.user.friends) {
      this.usersService.get(friend).subscribe(user => {
        this.friends.push(user);
      });
    }
  }

  friendInfo(user: User) {
    this.loadAddUser = false;
    this.infoUser = user;
    this.modalActions.emit({action: 'modal', params: ['open']});
    // this.user.friends.splice(0, this.user.friends.length);
    // this.friends.splice(0, this.friends.length);
    // this.usersService.edit(this.user).subscribe((usr) => {
    //   this.sessionService.setUser(this.user);
    // });
  }

  deleteUserAsFriend(user: User) {
    this.loadAddUser = false;
    const pos = this.user.friends.indexOf(user.id);
    this.user.friends.splice(pos, 1);
    this.friends = this.friends.filter(item => {
      return item.id !== user.id;
    });
    this.usersService.edit(this.user).subscribe((usr) => {
      this.sessionService.setUser(this.user);
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

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

}
