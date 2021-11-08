import { Component } from '@angular/core';

/**
 * @title Usermenu Custom Image
 * @order 50
 */
@Component({
  selector: 'sbb-usermenu-custom-image-example',
  templateUrl: 'usermenu-custom-image-example.html',
})
export class UsermenuCustomImageExample {
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
