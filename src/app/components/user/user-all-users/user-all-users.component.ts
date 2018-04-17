import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';

import { User } from './../../../shared/models/user.model';
import { UsersService } from './../../../shared/services/users.service';

@Component({
  selector: 'app-user-all-users',
  templateUrl: './user-all-users.component.html',
  styleUrls: ['./user-all-users.component.css']
})
export class UserAllUsersComponent implements OnInit {
  @Input() user: User;
  @Output() addUser: EventEmitter<User> = new EventEmitter<User>();
  users: Array<User> = [];
  apiError: string;

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.usersService.show().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.log(error);
        this.apiError = error;
      }
    );
  }
  addUserAsFriend(id) {
    this.user.friends.push(id);
    this.usersService.edit(this.user).subscribe(
      (user) => {
        console.log('ADD FRIEND');
        console.log(user);
        this.addUser.emit(user);
      },
      (error) => {
        console.log('ADD FRIEND ERROR');
        this.apiError = error;
      }
    );
  }

  deleteUserAdmin(user: User) {
    // this.user.friends.push(user);
    this.usersService.edit(this.user).subscribe(
      (usr) => {
        console.log('ADD FRIEND');
        console.log(usr);
        // this.onAddUser.emit(false);
      },
      (error) => {
        console.log('ADD FRIEND ERROR');
        this.apiError = error;
      }
    );
  }

}
