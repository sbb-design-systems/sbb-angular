The usermenu is intended to log on / off and offers the logged-in user a menu
with comprehensive functionalities.

### When should the module be used?

Whenever the user should be able to log in to an application.

### Characteristics and states

The module has the following states:

- Logged in (when you click on the login button) : in collapsed and expanded status.

In the collapsed status, you can see your icon (an image you can provide) or if you doesn't
provide it, you can see the initial letters of your name and surname. Clicking on the arrow
down you can go to the expanded status.

In the expanded status, you can always see your icon / initial letters, the displayName or,
if it isn't provided, the username is displayed.

- Logged out

### Example

- Logged in with an image provided from user:

```html
<h4 class="sbbsc-block">Basic Example with custom user image and with userName and displayName</h4>
<sbb-usermenu
  [userName]="user1.userName"
  [displayName]="user1.displayName"
  (loginRequest)="login()"
>
  <img class="image" sbbIcon src="assets/images/user-avatar.png" />
  <sbb-dropdown>
    <a
      *ngFor="let link of links"
      sbbDropdownItem
      [routerLink]="linkGenerator(link.page).routerLink"
      [queryParams]="linkGenerator(link.page).queryParams"
      routerLinkActive="sbb-selected"
      >{{ link.text }}
    </a>
    <hr />
    <button sbbDropdownItem type="button" (click)="logout(user1)">Logout</button>
  </sbb-dropdown>
</sbb-usermenu>
```

- Logged in without user image but with displayName and userName:

```html
<h4 class="sbbsc-block">Example without user image but with displayName and userName</h4>
<sbb-usermenu
  [userName]="user2.userName"
  [displayName]="user2.displayName"
  (loginRequest)="login2()"
>
  <sbb-dropdown>
    <a
      *ngFor="let link of links"
      sbbDropdownItem
      [routerLink]="linkGenerator(link.page).routerLink"
      [queryParams]="linkGenerator(link.page).queryParams"
      routerLinkActive="sbb-selected"
      >{{ link.text }}
    </a>
    <hr />
    <button sbbDropdownItem type="button" (click)="logout(user2)">Logout</button>
  </sbb-dropdown>
</sbb-usermenu>
```

- Logged in only with username:

```html
<h4 class="sbbsc-block">Example only with userName</h4>
<sbb-usermenu [userName]="user3.userName" (loginRequest)="login3()">
  <sbb-dropdown>
    <a
      *ngFor="let link of links"
      sbbDropdownItem
      [routerLink]="linkGenerator(link.page).routerLink"
      [queryParams]="linkGenerator(link.page).queryParams"
      routerLinkActive="sbb-selected"
      >{{ link.text }}
    </a>
    <hr />
    <button sbbDropdownItem type="button" (click)="logout(user3)">Logout</button>
  </sbb-dropdown>
</sbb-usermenu>
```
