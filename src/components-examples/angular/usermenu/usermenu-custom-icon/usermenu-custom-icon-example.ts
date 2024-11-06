import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';
import { SbbUsermenuModule } from '@sbb-esta/angular/usermenu';

/**
 * @title Usermenu Custom Icon
 * @order 40
 */
@Component({
  selector: 'sbb-usermenu-custom-icon-example',
  templateUrl: 'usermenu-custom-icon-example.html',
  imports: [SbbUsermenuModule, SbbIconModule, SbbMenuModule, RouterLink, RouterLinkActive],
})
export class UsermenuCustomIconExample {
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
