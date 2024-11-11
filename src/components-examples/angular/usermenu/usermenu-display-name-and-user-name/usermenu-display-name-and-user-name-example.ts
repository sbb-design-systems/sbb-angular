import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';
import { SbbUsermenuModule } from '@sbb-esta/angular/usermenu';

/**
 * @title Usermenu Display Name And User Name
 * @order 30
 */
@Component({
  selector: 'sbb-usermenu-display-name-and-user-name-example',
  templateUrl: 'usermenu-display-name-and-user-name-example.html',
  imports: [SbbUsermenuModule, SbbMenuModule, RouterLink, RouterLinkActive, SbbIconModule],
})
export class UsermenuDisplayNameAndUserNameExample {
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
