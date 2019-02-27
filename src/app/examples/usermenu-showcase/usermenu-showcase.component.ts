import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { LinkGeneratorResult } from 'sbb-angular';
import { DropdownTriggerDirective } from 'projects/sbb-angular/src/lib/dropdown/dropdown-trigger.directive';

class User {
  userName: string;
  displayName?: string;
  iconUrl?: string;
}

@Component({
  selector: 'sbb-usermenu-showcase',
  templateUrl: './usermenu-showcase.component.html',
  styleUrls: ['./usermenu-showcase.component.scss']
})
export class UserMenuShowcaseComponent implements OnInit {

  @ViewChildren(DropdownTriggerDirective) triggers: QueryList<DropdownTriggerDirective>;

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
    iconUrl: 'https://issues-ext.sbb.ch/secure/useravatar?size=small&avatarId=10123'
  };

  loggedUser2: User = {
    userName: 'ABB1234',
    displayName: null,
    iconUrl: null
  };

  loggedUser3: User = {
    userName: 'max 98',
    displayName: 'Max Muster',
    iconUrl: null
  };

  links: Array<any> = [
    { page: 1, text: 'Benutzerkonto' },
    { page: 2, text: 'Eintrag 2' },
    { page: 3, text: 'Eintrag 3' }
  ];

  constructor() {

  }

  ngOnInit() {
  }

  linkGenerator(page: string): LinkGeneratorResult {
    return {
      queryParams: { page: page },
      routerLink: ['.']
    };
  }

  logIn($event: any) {
    Object.assign(this.user, this.loggedUser);

    console.log('login successful');
  }

  logIn2($event: any) {
    Object.assign(this.user2, this.loggedUser2);
    console.log('login successful');
  }

  logIn3($event: any) {
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
