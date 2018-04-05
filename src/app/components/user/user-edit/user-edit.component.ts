import { GlobalErrorHandlerService } from './../../../shared/services/global-error-handler.service';
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
  apiError: object;

  constructor(
    private usersService: UsersService,
    private routes: ActivatedRoute,
    private router: Router,
    private globalErrorHandlerService: GlobalErrorHandlerService
  ) { }

  ngOnInit() {
    this.routes.params.subscribe((params) => {
      console.log(params);
      const id = params['id'];
      console.log(id);
      // 5ac50598dabd0d33a48ceb1d
      this.usersService.get('5ac50598dabd0d33a48ceb1d').subscribe(
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
        this.router.navigate(['/users', user.id]);
      },
      (error) => {
        console.log(error);
        this.apiError = error.message;
      }
    );
  }
}
