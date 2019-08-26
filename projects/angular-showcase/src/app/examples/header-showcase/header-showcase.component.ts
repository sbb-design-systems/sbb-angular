import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-header-showcase',
  templateUrl: './header-showcase.component.html',
  styleUrls: ['./header-showcase.component.scss']
})
export class HeaderShowcaseComponent implements OnInit {
  label: String = 'Example Header';
  loggedUser = {
    userName: 'example user',
    displayName: 'user001'
  };
  emptyUser = {
    userName: null,
    displayName: null
  };
  user = this.loggedUser;

  constructor() {}

  ngOnInit() {}

  login() {
    this.user = this.loggedUser;
  }

  logout(user: any) {
    this.user = this.emptyUser;
  }
}
