import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { LinkGeneratorResult } from 'sbb-angular';

@Component({
  selector: 'sbb-usermenu-showcase',
  templateUrl: './usermenu-showcase.component.html',
  styleUrls: ['./usermenu-showcase.component.scss']
})
export class UserMenuShowcaseComponent {

  userName = null;
  userName2 = null;
  userName3 = null;

  userNameLogged = 'ABB1234';
  displayName = null;

  userNameLogged2 = 'ABB1234';
  displayName2 = null;

  userNameLogged3 = 'max 98';
  displayName3 = 'Max Muster';

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
    this.userName = this.userNameLogged;
    console.log('login successful');
  }

  login2($event: any) {
    this.userName2 = this.userNameLogged2;
    console.log('login successful');
  }

  login3($event: any) {
    this.userName3 = this.userNameLogged3;
    console.log('login successful');
  }

  logout() {
    console.log('Logout');
    this.userName = null;
  }

  logout2() {
    console.log('Logout');
    this.userName2 = null;
  }

  logout3() {
    console.log('Logout');
    this.userName3 = null;
  }

}
