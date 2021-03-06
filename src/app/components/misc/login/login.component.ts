import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from './../../../shared/services/session.service';
import { User } from './../../../shared/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = new User();
  apiError: object;

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit() { }

  onSubmitLogin(loginForm: NgForm) {
    this.sessionService.authenticate(this.user).subscribe(
      (user) => {
        loginForm.reset();
        this.router.navigate(['/users', user.id]);
      },
      (error) => {
        console.log(error);
        // this.apiError = error;
        window.alert(error);
      }
    );
  }
}
