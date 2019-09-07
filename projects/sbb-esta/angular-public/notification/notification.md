You can use the notification component to send a simple message:

```html
<h4 id="default">Default success notification</h4>
<sbb-notification message="Suchen" type="success"></sbb-notification>
```

There are three types of notifications:

- success
- info
- error

### Custom Icon

It is also possible to send a notification message with a custom icon
(using \*sbbIcon directive) as seen below

```html
<h4>Notification with custom icon</h4>
<sbb-notification message="Suchen" type="error">
  <sbb-icon-clock *sbbIcon></sbb-icon-clock>
</sbb-notification>
```

### Jump Marks

It is possible to provide a list of jump marks to the notification component, which will be
displayed with links to the given element ids.

```ts
export interface JumpMark {
  /** Title of an element in jump marks. */
  title: string;
  /** Identifier of an element in jump marks. */
  elementId: string;
}
```

```html
<h4>Error notification with jump marks and custom icon</h4>
<sbb-notification message="Please fix the form errors" type="error" [jumpMarks]="jumpMarks">
  <sbb-icon-gluehbirne-an *sbbNotificationIcon></sbb-icon-gluehbirne-an>
</sbb-notification>
```
