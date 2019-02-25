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

  loggedUser: User = {
    userName: 'max 98',
    displayName: 'Max Muster',
    iconUrl: 'https://issues-ext.sbb.ch/secure/useravatar?size=small&avatarId=10123'
  };

  loggedUser2: User = {
    userName: 'max 98',
    displayName: 'Max Muster',
    iconUrl: 'https://issues-ext.sbb.ch/secure/useravatar?size=small&avatarId=10123'
  };

  loggedUser3: User = {
    userName: 'max 98',
    displayName: 'Max Muster',
    iconUrl: 'https://issues-ext.sbb.ch/secure/useravatar?size=small&avatarId=10123'
  };

  user: User = {
    userName: null
  };

  user2: User = {
    userName: null
  };

  user3: User = {
    userName: null
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

  logout() {

    console.log('Logout');
    this.user.userName = null;

  }

  logIn($event:any) {
    Object.assign(this.user, this.loggedUser);

    console.log('login successful');
  }

}
