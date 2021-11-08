import { Component } from '@angular/core';

/**
 * @title Usermenu Display Name
 * @order 20
 */
@Component({
  selector: 'sbb-usermenu-display-name-example',
  templateUrl: 'usermenu-display-name-example.html',
})
export class UsermenuDisplayNameExample {
  displayName?: string;

  login() {
    this.displayName = 'Walter Scotti';
    console.log('login successful');
  }

  logout() {
    this.displayName = undefined;
    console.log('Logout');
  }
}
