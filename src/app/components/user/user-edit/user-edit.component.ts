import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { SessionService } from './../../../shared/services/session.service';
import { GlobalErrorHandlerService } from './../../../shared/services/global-error-handler.service';
import { User } from './../../../shared/models/user.model';
import { UsersService } from './../../../shared/services/users.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  user: User = new User();
  apiError: object;

  constructor(
    private usersService: UsersService,
    private routes: ActivatedRoute,
    private router: Router,
    private globalErrorHandlerService: GlobalErrorHandlerService,
    private sessionService: SessionService,
  ) { }

  ngOnInit() {
    this.routes.parent.params.subscribe((params) => {
      console.log(params);
      const id = params['id'];
      console.log(id);
      // 5ac50598dabd0d33a48ceb1d
      this.usersService.get(id).subscribe(
        (user) => this.user = user,
        (error) => {
          console.log('error');
          this.globalErrorHandlerService.handleError(error);
          this.apiError = error;
        }
      );
    });
  }
  onSubmitUpdate(form: NgForm) {
    this.usersService.edit(this.user).subscribe(
      (user) => {
        console.log(user);
        this.sessionService.setUser(user);
        this.router.navigate(['/users', user.id]);
      },
      (error) => {
        console.log(error);
        this.apiError = error.message;
      }
    );
  }
}
