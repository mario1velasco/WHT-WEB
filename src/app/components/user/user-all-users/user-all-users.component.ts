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
    console.log(this.user);
    this.usersService.edit(id).subscribe(
      (chat) => {
        console.log('ADD USER');
        // this.onAddUser.emit(false);
      },
      (error) => {
        console.log('ADD USER ERROR');
        this.apiError = error;
      }
    );
  }

}
