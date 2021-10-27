import { Component, NgModule } from '@angular/core';
import { SbbIconModule, SbbUsermenuItem, SbbUsermenuModule } from '@sbb-esta/angular-public';
import { RouterModule } from '@angular/router';

@Component({
  template: `
    <sbb-usermenu [userName]="userName" (loginRequest)="login()">
      <sbb-icon svgIcon="kom:avatar-train-staff-small" *sbbIcon></sbb-icon>
      <a sbb-usermenu-item [queryParams]="{ page: 0 }" routerLink="." routerLinkActive="sbb-active">
        <sbb-icon svgIcon="kom:user-small" class="sbb-icon-fit"></sbb-icon> Account
      </a>
      <a
        sbb-usermenu-item
        [queryParams]="{ page: 1 }"
        routerLink="."
        routerLinkActive="sbb-selected"
      >
        <sbb-icon svgIcon="kom:tickets-class-small" class="sbb-icon-fit"></sbb-icon> Orders
      </a>
      <a sbb-usermenu-item [queryParams]="{ page: 1 }" routerLink=".">
        <sbb-icon svgIcon="kom:tickets-class-small" class="sbb-icon-fit"></sbb-icon> Other thing
      </a>
      <hr />
      <button type="button" sbb-usermenu-item (click)="logout()">
        <sbb-icon svgIcon="kom:exit-small" class="sbb-icon-fit"></sbb-icon> Logout
      </button>
    </sbb-usermenu>
  `,
})
export class UsermenuTestComponent {
  userName: any;

  usermenuItem: SbbUsermenuItem;

  login() {}

  logout() {}
}

@NgModule({
  declarations: [UsermenuTestComponent],
  imports: [SbbUsermenuModule, SbbIconModule, RouterModule],
})
export class UsermenuTestModule {}
