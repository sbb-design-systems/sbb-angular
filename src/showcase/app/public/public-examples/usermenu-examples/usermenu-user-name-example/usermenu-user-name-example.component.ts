import { Component } from '@angular/core';

@Component({
  selector: 'sbb-usermenu-user-name-example',
  templateUrl: './usermenu-user-name-example.component.html',
})
export class UsermenuUserNameExampleComponent {
  userName: string;

  login() {
    this.userName = 'walter_14';
    console.log('login successful');
  }

  logout() {
    this.userName = null;
    console.log('Logout');
  }
}
