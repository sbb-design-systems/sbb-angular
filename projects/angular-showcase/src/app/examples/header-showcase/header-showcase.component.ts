import { Component } from '@angular/core';

@Component({
  selector: 'sbb-header-showcase',
  templateUrl: './header-showcase.component.html',
  styleUrls: ['./header-showcase.component.scss']
})
export class HeaderShowcaseComponent {
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

  login() {
    this.user = this.loggedUser;
  }

  logout(user: any) {
    this.user = this.emptyUser;
  }
}
