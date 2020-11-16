import { Component } from '@angular/core';

@Component({
  selector: 'sbb-usermenu-display-name-and-user-name-example',
  templateUrl: './usermenu-display-name-and-user-name-example.component.html',
})
export class UsermenuDisplayNameAndUserNameExampleComponent {
  userName: string;
  displayName: string;

  login() {
    this.userName = 'walter_14';
    this.displayName = 'Walter Scotti';
    console.log('login successful');
  }

  logout() {
    this.userName = null;
    this.displayName = null;
    console.log('Logout');
  }
}
