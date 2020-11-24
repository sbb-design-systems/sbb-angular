import { Component } from '@angular/core';

@Component({
  selector: 'sbb-usermenu-custom-icon-example',
  templateUrl: './usermenu-custom-icon-example.component.html',
})
export class UsermenuCustomIconExampleComponent {
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
