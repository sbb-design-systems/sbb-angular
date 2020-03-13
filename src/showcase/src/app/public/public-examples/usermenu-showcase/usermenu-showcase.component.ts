import { Component } from '@angular/core';
import { LinkGeneratorResult } from '@sbb-esta/angular-core/models';

@Component({
  selector: 'sbb-usermenu-showcase',
  templateUrl: './usermenu-showcase.component.html',
  styleUrls: ['./usermenu-showcase.component.css']
})
export class UsermenuShowcaseComponent {
  userName1 = 'john_64';
  userName2 = 'max_98';
  userName3 = 'walter_14';

  user1 = {
    userName: null,
    displayName: 'John Scott'
  };

  user2 = {
    userName: null,
    displayName: 'Max Muster'
  };

  user3 = {
    userName: null,
    displayName: 'Walter Scotti'
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

  login() {
    this.user1.userName = this.userName1;
    console.log('login successful');
  }

  login2() {
    this.user2.userName = this.userName2;
    console.log('login successful');
  }

  login3() {
    this.user3.userName = this.userName3;
    console.log('login successful');
  }

  logout(user: any) {
    console.log('Logout');
    user.userName = null;
  }
}
