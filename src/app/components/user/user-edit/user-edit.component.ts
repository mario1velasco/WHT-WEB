import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('updateForm') updateForm;
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
      const id = params['id'];
      this.user = this.sessionService.getUser();
    });
  }
  onSubmitUpdate(form: NgForm) {
    this.usersService.edit(this.user).subscribe(
      (user) => {
        this.sessionService.setUser(user);
        this.router.navigate(['/users', user.id]);
      },
      (error) => {
        console.log(error);
        window.alert(error);
        // this.apiError = error.message;
      }
    );
  }
  canLeaveTheComponent(): boolean {
    if (this.updateForm.dirty) {
      return window.confirm(`
        Unsaved changes.
        Are you sure you want to leave?
    `);
    } else {
      return true;
    }
  }
}
