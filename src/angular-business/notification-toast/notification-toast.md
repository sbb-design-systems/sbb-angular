`SbbNotificationToast` is a service for displaying notification toasts.

### Opening a notification toast

A notification toast can contain either a message, a ng-template or a given component.

```typescript
// Simple message.
const notificationToastRef = notificationToast.open('Message archived');

// Load the given template into the notification toast (e.g. via @ViewChild).
const notificationToastRef = notificationToast.openFromTemplate(templateRef);

// Load the given component into the notification toast.
const notificationToastRef = notificationToast.openFromComponent(MessageArchivedComponent);
```

For each opening variant a `SbbNotificationToastRef` is returned. This can be used to dismiss the
notification toast or receive notification of when the notification toast is dismissed. If you want
to close a custom notification toast that was opened via openFromComponent, from within the
component itself, you can inject the `SbbNotificationToastRef`.

```typescript
notificationToastRef.afterDismissed().subscribe(() => {
  console.log('The notification toast was dismissed');
});

notificationToastRef.dismiss();
```

### Notification type

Notification toast supports four notification types:

- success (default)
- info
- error
- warning

```typescript
notificationToast.open('This is an info', {
  type: 'info',
});
```

### Dismissal

A notification toast can be dismissed manually by calling the dismiss method on the
`SbbNotificationToastRef` returned from the call to open.

Only one notification toast can ever be opened at one time. If a new notification toast is opened
while a previous message is still showing, the older message will be automatically dismissed.

A notification toast can also be given a duration via the optional configuration object:

```typescript
notificationToast.open('Message archived', {
  duration: 3000,
});
```

### Sharing data with a custom notification toast

You can share data with the custom notification toast, that you opened via the `openFromComponent` method,
by passing it through the `data` property.

```ts
notificationToast.openFromComponent(MessageArchivedComponent, {
  data: 'some data',
});
```

To access the data in your component, you have to use the `SBB_NOTIFICATION_TOAST_DATA` injection token:

```ts
import { Component, Inject } from '@angular/core';
import { SBB_NOTIFICATION_TOAST_DATA } from '@sbb-esta/angular-business/notification-toast';

@Component({
  selector: 'your-notification-toast',
  template: 'passed in {{ data }}',
})
export class MessageArchivedComponent {
  constructor(@Inject(SBB_NOTIFICATION_TOAST_DATA) public data: any) {}
}
```

### Setting the global configuration defaults

If you want to override the default notification toast options, you can do so using the
`SBB_NOTIFICATION_TOAST_DEFAULT_OPTIONS` injection token.

```ts
@NgModule({
  providers: [
    {provide: SBB_NOTIFICATION_TOAST_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ]
})
```

### Accessibility

Notification toast messages are announced via an `aria-live` region. By default, the `polite` setting is
used. While `polite` is recommended, this can be customized by setting the `politeness` property of
the `SbbNotificationToastConfig`.

Focus is not, and should not be, moved to the notification toast element. Moving the focus would be
disruptive to a user in the middle of a workflow. It is recommended that, for any action offered
in the notification toast, the application offer the user an alternative way to perform the action.
Alternative interactions are typically keyboard shortcuts or menu options. When the action is
performed in this way, the notification toast should be dismissed.
