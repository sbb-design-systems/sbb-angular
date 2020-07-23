You can use the notification component to send a simple message:

```html
<sbb-notification message="Success" type="success"></sbb-notification>
```

There are three types of notifications:

- success
- info
- error

### Custom Icon

It is also possible to send a notification message with a custom icon
(using \*sbbIcon directive) as seen below

```html
<sbb-notification message="New timezone saved successfully" type="error">
  <sbb-icon svgIcon="kom:clock-small" *sbbIcon></sbb-icon>
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
<sbb-notification message="Please fix the form errors" type="error" [jumpMarks]="jumpMarks">
  <sbb-icon svgIcon="kom:cloud-sunshine-small" *sbbIcon></sbb-icon>
</sbb-notification>
```
