The usermenu is intended to log in / out a user and offers the logged-in user a menu
with comprehensive functionalities. The usermenu should be placed in a site header, e.g. the `<sbb-header>`.

### Log in

To set the usermenu as logged in, react to `(loginRequest)` output event of `<sbb-usermenu>`
and set either `userName` or `displayName` properties of `<sbb-usermenu>`.

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

To log out a user, just invalidate `userName` and `displayName` properties of `sbb-usermenu`.

### `displayName` vs `userName`

If the menu is collapsed, only the `displayName` is shown, except on mobile devices where no name at all is being displayed.
If the menu is expanded, `displayName` and `userName` are shown.
If both `displayName` and `userName` are provided, the `userName` has a smaller font size.

### Custom icon or custom image

By default, the initial letters of a user are displayed next to the user name.
As an alternative, you can either provide a custom icon or image by applying the `*sbbIcon` directive.

#### Custom icon

```html
<sbb-usermenu [userName]="userName">
  <sbb-icon svgIcon="kom:avatar-train-staff-small" *sbbIcon></sbb-icon>
  ...
</sbb-usermenu>
```

#### Custom image

```html
<sbb-usermenu [userName]="userName">
  <img src="assets/sbb-logo.png" alt="SBB Logo" *sbbIcon />
  ...
</sbb-usermenu>
```

### Menu content

The expanded usermenu respects `<a sbb-usermenu-item>`, `<button sbb-usermenu-item>` and `<hr />` tags.
The last button in the menu should be the logout button.
`<sbb-icon>` icons can optionally be used in menu items.

```html
<sbb-usermenu [userName]="userName" [displayName]="displayName" (loginRequest)="login()">
  <a sbb-usermenu-item routerLink="." routerLinkActive="sbb-selected">
    <sbb-icon svgIcon="kom:user-small" class="sbb-icon-fit"></sbb-icon> Account
  </a>
  <a sbb-usermenu-item routerLink="." routerLinkActive="sbb-selected">
    <sbb-icon svgIcon="kom:tickets-class-small" class="sbb-icon-fit"></sbb-icon> Orders
  </a>
  <hr />
  <button sbb-usermenu-item (click)="logout()">
    <sbb-icon svgIcon="kom:exit-small" class="sbb-icon-fit"></sbb-icon> Logout
  </button>
</sbb-usermenu>
```
