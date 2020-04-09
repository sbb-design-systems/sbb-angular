import { Component } from '@angular/core';

@Component({
  selector: 'sbb-usermenu-example',
  templateUrl: './usermenu-example.component.html',
  styleUrls: ['./usermenu-example.component.css']
})
export class UsermenuExampleComponent {
  userName = 'walter_14';

  user = {
    userName: '',
    displayName: 'Walter Scotti'
  };

  links: Array<any> = [
    { page: 1, text: 'Benutzerkonto' },
    { page: 2, text: 'Eintrag 2' },
    { page: 3, text: 'Eintrag 3' }
  ];

  linkGenerator(page: string) {
    return {
      queryParams: { page: page },
      routerLink: ['.']
    };
  }

  login() {
    this.user.userName = this.userName;
    console.log('login successful');
  }

  logout(user: any) {
    console.log('Logout');
    user.userName = null;
  }
}
