The usermenu is intended to log in / out a user and offers the logged-in user a menu
with comprehensive functionalities. The usermenu should be placed in a site header, e.g. the `<sbb-header-lean>`.

### Log in

To assign logged in state set either `userName` or `displayName` inputs of `<sbb-usermenu>`.
In the logged out state the user can click on the usermenu to request to log in. This will emit a `(loginRequest)` event.

```html
<sbb-usermenu [userName]="userName" (loginRequest)="login()"> ... </sbb-usermenu>
```

```ts
class YourComponent {
  userName: string;
  login() {
    this.userName = 'Walter Scotti';
  }
}
```

### Log out

To log out a user, assign falsy values to the `userName` and `displayName` inputs of `sbb-usermenu`.

### `displayName` vs `userName`

If the menu is collapsed, only the `displayName` is shown, except on mobile devices where no name at all is being displayed.
If the menu is expanded, `displayName` and `userName` are shown.
If both `displayName` and `userName` are provided, the `userName` has a smaller font size.

### Custom icon or custom image

By default, the initial letters of a user are displayed next to the username.
As an alternative, you can either provide a custom icon or image by applying the `*sbbIcon` directive.

#### Custom icon

```html
<sbb-usermenu [userName]="userName">
  <sbb-icon svgIcon="kom:avatar-train-staff-small" *sbbIcon></sbb-icon>
</sbb-usermenu>
```

#### Custom image

```html
<sbb-usermenu [userName]="userName">
  <img src="assets/sbb-logo.png" alt="SBB Logo" *sbbIcon />
</sbb-usermenu>
```

### Menu

To provide a menu with actions and links, please use the `<sbb-menu #menu="sbbMenu">`
and link it with the `<sbb-username [menu]=""menu">` tag by reference.
Note that you must import `SbbMenuModule` from `@sbb-esta/angular/menu` yourself.

Please see the [Menu documentation](/angular/components/menu) for more details of the menu usage.

```html
<sbb-usermenu
  [menu]="menu"
  [userName]="userName"
  [displayName]="displayName"
  (loginRequest)="login()"
></sbb-usermenu>
<sbb-menu #menu="sbbMenu">
  <a sbb-menu-item routerLink="." routerLinkActive="sbb-active">
    <sbb-icon svgIcon="kom:user-small" class="sbb-icon-fit"></sbb-icon> Account
  </a>
  <a sbb-menu-item routerLink="." routerLinkActive="sbb-active">
    <sbb-icon svgIcon="kom:tickets-class-small" class="sbb-icon-fit"></sbb-icon> Orders
  </a>
  <hr />
  <button type="button" sbb-menu-item (click)="logout()">
    <sbb-icon svgIcon="kom:exit-small" class="sbb-icon-fit"></sbb-icon> Logout
  </button>
</sbb-menu>
```
