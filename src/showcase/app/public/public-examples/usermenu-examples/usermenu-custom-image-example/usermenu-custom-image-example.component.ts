import { Component } from '@angular/core';

@Component({
  selector: 'sbb-usermenu-custom-image-example',
  templateUrl: './usermenu-custom-image-example.component.html',
})
export class UsermenuCustomImageExampleComponent {
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
