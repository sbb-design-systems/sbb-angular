import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';
import { SbbUsermenuModule } from '@sbb-esta/angular/usermenu';

/**
 * @title Usermenu User Name
 * @order 10
 */
@Component({
  selector: 'sbb-usermenu-user-name-example',
  templateUrl: 'usermenu-user-name-example.html',
  imports: [SbbUsermenuModule, SbbMenuModule, RouterLink, RouterLinkActive, SbbIconModule],
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
