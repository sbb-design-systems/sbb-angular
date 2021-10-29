import { Component, NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuItem } from '@sbb-esta/angular/menu';
import { SbbUsermenuModule } from '@sbb-esta/angular/usermenu';
import { RouterModule } from '@angular/router';

@Component({
  template: `
    <sbb-usermenu [menu]="menu" [userName]="userName" (loginRequest)="login()">
<sbb-icon svgIcon="kom:avatar-train-staff-small" *sbbIcon></sbb-icon>
</sbb-usermenu>
<sbb-menu #menu="sbbMenu">
      
      <a sbb-menu-item [queryParams]="{ page: 0 }" routerLink="." routerLinkActive="sbb-active">
        <sbb-icon svgIcon="kom:user-small" class="sbb-icon-fit"></sbb-icon> Account
      </a>
      <a
        sbb-menu-item
        [queryParams]="{ page: 1 }"
        routerLink="."
        routerLinkActive="sbb-active"
      >
        <sbb-icon svgIcon="kom:tickets-class-small" class="sbb-icon-fit"></sbb-icon> Orders
      </a>
      <a sbb-menu-item [queryParams]="{ page: 1 }" routerLink=".">
        <sbb-icon svgIcon="kom:tickets-class-small" class="sbb-icon-fit"></sbb-icon> Other thing
      </a>
      <hr />
      <button type="button" sbb-menu-item (click)="logout()">
        <sbb-icon svgIcon="kom:exit-small" class="sbb-icon-fit"></sbb-icon> Logout
      </button>
    </sbb-menu>
  `,
})
export class UsermenuTestComponent {
  userName: any;

  usermenuItem: SbbMenuItem;

  login() {}

  logout() {}
}

@NgModule({
  declarations: [UsermenuTestComponent],
  imports: [SbbUsermenuModule, SbbIconModule, RouterModule],
})
export class UsermenuTestModule {}
