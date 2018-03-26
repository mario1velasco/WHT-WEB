import { Component, OnInit } from '@angular/core';

import { User } from './../../../shared/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: User = new User();

  constructor() { }

  ngOnInit() {
  }

}
