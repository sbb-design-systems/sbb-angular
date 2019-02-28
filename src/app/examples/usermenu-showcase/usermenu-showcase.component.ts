import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { LinkGeneratorResult } from 'sbb-angular';

interface User {
  userName: string;
  displayName?: string;
}

@Component({
  selector: 'sbb-usermenu-showcase',
  templateUrl: './usermenu-showcase.component.html',
  styleUrls: ['./usermenu-showcase.component.scss']
})
export class UserMenuShowcaseComponent {

  user: User = {
    userName: null
  };

  user2: User = {
    userName: null
  };

  user3: User = {
    userName: null
  };

  loggedUser: User = {
    userName: 'ABB1234',
    displayName: null,
  };

  loggedUser2: User = {
    userName: 'ABB1234',
    displayName: null,
  };

  loggedUser3: User = {
    userName: 'max 98',
    displayName: 'Max Muster',
  };

  links: Array<any> = [
    { page: 1, text: 'Benutzerkonto' },
    { page: 2, text: 'Eintrag 2' },
    { page: 3, text: 'Eintrag 3' }
  ];

  linkGenerator(page: string): LinkGeneratorResult {
    return {
      queryParams: { page: page },
      routerLink: ['.']
    };
  }

  login($event: any) {
    Object.assign(this.user, this.loggedUser);

    console.log('login successful');
  }

  login2($event: any) {
    Object.assign(this.user2, this.loggedUser2);
    console.log('login successful');
  }

  login3($event: any) {
    Object.assign(this.user3, this.loggedUser3);

    console.log('login successful');
  }

  logout() {
    console.log('Logout');
    this.user.userName = null;
  }

  logout2() {
    console.log('Logout');
    this.user2.userName = null;
  }

  logout3() {
    console.log('Logout');
    this.user3.userName = null;
  }

}
