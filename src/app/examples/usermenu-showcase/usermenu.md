# User Menu Overview

Import user menu module into your application

```ts
import { UserMenuModule } from 'sbb-angular';
```

### What does user menu module do?

To log on / off and offers the logged-in user a menu with comprehensive functionalities.

<br>

### When should the module be used?

Whenever the user should be able to log in to an application.

<br>

### Characteristics and states

The module has the following states:

* Logged in (when you click on the login button) : in collapsed and expanded status.

In the collapsed status, you can see your icon (an image you can provide) or if you doesn't provide it, you can see the initial letters of your name and surname. Clicking on the arrow down you can go to the expanded status. <br>
In the expanded status, you can always see your icon / initial letters, displayName and additional informations as your username.

* Logged out 

### Example 

* Logged in with an image provided from user

```html
<h4 class="sbbsc-block">Basic Example with custom user image</h4>
<sbb-usermenu [userName]="user1.userName" [displayName]="user1.displayName" (loginRequest)="login()">
  <img class="image" sbbIcon src="assets/images/user-avatar.png">
    <sbb-dropdown>
      <a *ngFor="let link of links" sbbDropdownItem 
                                    [routerLink]="linkGenerator(link.page).routerLink"
                                    [queryParams]="linkGenerator(link.page).queryParams" 
                                    routerLinkActive="sbb-selected">{{ link.text }}
      </a>
      <hr>
      <button sbbDropdownItem type="button" (click)="logout(user1)">Abmeldung</button>
    </sbb-dropdown>
</sbb-usermenu>
```

* Logged in with initial letters of name and surname (if user doesn't provide an image) and username displayed.

```html
<h4 class="sbbsc-block">Example without user image</h4>
<sbb-usermenu [userName]="user2.userName" [displayName]="user2.displayName" (loginRequest)="login2()">
  <sbb-dropdown>
    <a *ngFor="let link of links" sbbDropdownItem 
                                  [routerLink]="linkGenerator(link.page).routerLink"
                                  [queryParams]="linkGenerator(link.page).queryParams" 
                                  routerLinkActive="sbb-selected">{{ link.text }}
    </a>
    <hr>
    <button sbbDropdownItem type="button" (click)="logout(user2)">Abmeldung</button>
  </sbb-dropdown>
</sbb-usermenu>
 ```
