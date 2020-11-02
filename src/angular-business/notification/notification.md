You can use the notification component to send a simple message:

```html
<sbb-notification type="success">Success</sbb-notification>
```

There are four types of notifications:

- success
- info
- error
- warning

### Custom Icon

It is also possible to send a notification message with a custom icon
(using \*sbbIcon directive) as seen below

```html
<sbb-notification type="error">
  <sbb-icon svgIcon="kom:clock-small" *sbbIcon></sbb-icon> New timezone saved successfully
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
<sbb-notification type="error" [jumpMarks]="jumpMarks">
  <sbb-icon svgIcon="kom:cloud-sunshine-small" *sbbIcon></sbb-icon>
  Please fix the form errors
</sbb-notification>
```

### Readonly notifications

By setting the readonly property, the notification is not closable by user.

```html
<sbb-notification readonly> I can't be closed by user </sbb-notification>
```
