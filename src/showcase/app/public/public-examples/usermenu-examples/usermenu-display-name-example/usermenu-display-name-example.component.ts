import { Component } from '@angular/core';

@Component({
  selector: 'sbb-usermenu-display-name-example',
  templateUrl: './usermenu-display-name-example.component.html',
})
export class UsermenuDisplayNameExampleComponent {
  displayName: string;

  login() {
    this.displayName = 'Walter Scotti';
    console.log('login successful');
  }

  logout() {
    this.displayName = null;
    console.log('Logout');
  }
}
