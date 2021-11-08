import { Component } from '@angular/core';

/**
 * @title Usermenu User Name
 * @order 10
 */
@Component({
  selector: 'sbb-usermenu-user-name-example',
  templateUrl: 'usermenu-user-name-example.html',
})
export class UsermenuUserNameExample {
  userName?: string;

  login() {
    this.userName = 'walter_14';
    console.log('login successful');
  }

  logout() {
    this.userName = undefined;
    console.log('Logout');
  }
}
