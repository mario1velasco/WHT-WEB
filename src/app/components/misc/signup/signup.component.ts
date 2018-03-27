import { User } from './../../../shared/models/user.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: User = new User();
  emailPattern: String = '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})*$';
  passwordPattern: String = '^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$';
  constructor() { }

  ngOnInit() {
  }

}
