import { Component } from '@angular/core';

@Component({
  selector: 'sbb-usermenu-example',
  templateUrl: './usermenu-example.component.html',
})
export class UsermenuExampleComponent {
  userName = 'walter_14';

  user = {
    userName: '',
    displayName: 'Walter Scotti ist ein mega langer Name hihihih',
  };

  linkGenerator() {
    return {
      queryParams: { page: 0 },
      routerLink: ['.'],
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
