# Notification Overview

Import notification module into your application

```ts
import { NotificationsModule } from 'sbb-angular';
```
and then you can use the notification component to send a simple message:

```html
<h4 id="default">Default success notification</h4>
<sbb-notification message="Suchen" type="success"></sbb-notification>
```
There are three types of notification:
* success
* info
* error

to send respectively a success, info or error message.

It is also possible to send a notification message with a custom icon (using *sbbNotificationIcon directive) as see below

```html
<h4>Notification with custom icon</h4>
<sbb-notification message="Suchen" type="error">
    <sbb-icon-clock *sbbNotificationIcon></sbb-icon-clock>
</sbb-notification>
```

or with a custom icon and jumpMarks

```html
<h4>Success notification with jumpMarks and custom icon</h4>
<sbb-notification message="Suchen" type="success" [jumpMarks]="jumpMarks">
    <sbb-icon-gluehbirne-an *sbbNotificationIcon></sbb-icon-gluehbirne-an>
</sbb-notification>
```



