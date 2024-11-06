import { Component } from '@angular/core';
import { SbbMenuModule } from '@sbb-esta/angular/menu';
import { SbbUsermenuModule } from '@sbb-esta/angular/usermenu';

/**
 * @title Usermenu Custom Image
 * @order 50
 */
@Component({
  selector: 'sbb-usermenu-custom-image-example',
  templateUrl: 'usermenu-custom-image-example.html',
  imports: [SbbUsermenuModule, SbbMenuModule],
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
