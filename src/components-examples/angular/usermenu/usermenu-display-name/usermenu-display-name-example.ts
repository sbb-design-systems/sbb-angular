import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';
import { SbbUsermenuModule } from '@sbb-esta/angular/usermenu';

/**
 * @title Usermenu Display Name
 * @order 20
 */
@Component({
  selector: 'sbb-usermenu-display-name-example',
  templateUrl: 'usermenu-display-name-example.html',
  imports: [SbbUsermenuModule, SbbMenuModule, RouterLink, RouterLinkActive, SbbIconModule],
})
export class UsermenuDisplayNameExample {
  displayName?: string;

  login() {
    this.displayName = 'Walter Scotti';
    console.log('login successful');
  }

  logout() {
    this.displayName = undefined;
    console.log('Logout');
  }
}
