import { Component } from '@angular/core';

/**
 * @title Usermenu Custom Icon
 * @order 40
 */
@Component({
  selector: 'sbb-usermenu-custom-icon-example',
  templateUrl: 'usermenu-custom-icon-example.html',
})
export class UsermenuCustomIconExample {
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
