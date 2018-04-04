import { User } from './../../../shared/models/user.model';
import { UsersService } from './../../../shared/services/users.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  user: User = new User();
  apiError: string;

  constructor(
    private usersService: UsersService,
    private routes: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.routes.params.subscribe((params) => {
      console.log(params);
      const id = params['id'];
      console.log(id);
      //5ac50598dabd0d33a48ceb1d
      this.usersService.get('5ac50598dabd0d33a48ceb1d')
        .subscribe((user) => this.user = user);
    });
  }
  onSubmitUpdate(form: NgForm) {
    this.usersService.edit(this.user).subscribe(
      (user) => {
        this.router.navigate(['/users', user.id]);
      },
      (error) => {
        console.log(error);
        this.apiError = error.message;
      }
    );
  }
}
