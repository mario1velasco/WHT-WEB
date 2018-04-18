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
    const found = this.user.friends.indexOf(id);
    if (found === -1) {
      this.user.friends.push(id);
      console.log('USER TO EDIT');
      console.log(this.user);
      this.usersService.edit(this.user).subscribe(
        (user) => {
          console.log('ADD FRIEND and emit');
          console.log(user);
          this.addUser.emit(user);
        },
        (error) => {
          console.log('ADD FRIEND ERROR');
          this.apiError = error;
        }
      );
    } else {
      console.log('You have that user already as a friend');
    }
  }

}
