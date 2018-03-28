import { UsersService } from './../../../shared/services/users.service';
import { User } from './../../../shared/models/user.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: User = new User();
  apiError: string;

  emailPattern: String = '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})*$';
  passwordPattern: String = '^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$';

  constructor(
    private router: Router,
    private usersService: UsersService
  ) { }

  ngOnInit() {
  }

  onSubmitSignup(signupForm: NgForm) {
    this.usersService.create(this.user).subscribe(
      (user) => {
        signupForm.reset();
        this.router.navigate(['/login']);
      },
      (error) => {
        this.apiError = error.message;
      }
    );
  }
}
