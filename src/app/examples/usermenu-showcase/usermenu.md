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

In the collapsed status, you can see your icon (an image you can provide) or if you haven't provide it, you can see the initial letters of your username. Clicking on the arrow down you can go to the expanded status.
In the expanded status, you can always see your icon / initial letters and additional information as your name and surname.

* Logged out 

