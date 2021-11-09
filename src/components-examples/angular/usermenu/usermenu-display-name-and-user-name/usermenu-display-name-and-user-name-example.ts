import { Component } from '@angular/core';

/**
 * @title Usermenu Display Name And User Name
 * @order 30
 */
@Component({
  selector: 'sbb-usermenu-display-name-and-user-name-example',
  templateUrl: 'usermenu-display-name-and-user-name-example.html',
})
export class UsermenuDisplayNameAndUserNameExample {
  userName?: string;
  displayName?: string;

  login() {
    this.userName = 'walter_14';
    this.displayName = 'Walter Scotti';
    console.log('login successful');
  }

  logout() {
    this.userName = undefined;
    this.displayName = undefined;
    console.log('Logout');
  }
}
