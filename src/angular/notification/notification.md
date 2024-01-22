You can use the notification component to display a simple message.

```html
<sbb-notification>The action was successful.</sbb-notification>
```

### Notification types

We support different notification types: `success` (default), `info` and `error`.
In the lean design variant there are the additional types `info-light` and `warn`.

```html
<sbb-notification type="success">The action was successful.</sbb-notification>
<sbb-notification type="info">Additional information.</sbb-notification>
<sbb-notification type="error">The action was unsuccessful.</sbb-notification>

<!-- Lean only -->
<sbb-notification type="warn">A specific warning.</sbb-notification>
```

### Notification icon

The notification component uses a specific icon corresponding to the type.
It is also possible to provide a custom icon either via the `svgIcon` input or via
the `<sbb-notification-icon>` element.

```html
<sbb-notification svgIcon="clock-small"> New timezone saved successfully. </sbb-notification>

<sbb-notification>
  <sbb-notification-icon>
    <sbb-icon svgIcon="clock-small"></sbb-icon>
  </sbb-notification-icon>
  New timezone saved successfully.
</sbb-notification>
```

### Jump marks

It is possible to provide a list of jump marks to the notification component, which will be
displayed with links to the given element ids. Alternatively to an elementId, a callback can
be provided, which will be called on click on the jump mark.

```ts
export interface SbbJumpMark {
  /** Title of an element in jump marks. */
  title: string;
  /** Identifier of an element in jump marks. */
  elementId?: string;
  /** Callback to be called on click on the jump mark. */
  callback?: (event$: any, jumpMark: SbbJumpMark) => void;
}
```

```html
<sbb-notification type="error" [jumpMarks]="jumpMarks">
  Please fix the form errors.
</sbb-notification>
```

### Readonly notifications

By setting the readonly property, the notification is not closable by user.
This only applies to the Lean design, since Standard design notifications cannot be closed.

```html
<sbb-notification readonly>I can't be closed by user.</sbb-notification>
```

### Accessibility

For having the value of the notification announced by screen readers, we recommend adding
`role="alert"` to the element. This implicitly sets the `aria-live` value to `assertive`
and the `aria-atomic` value to `true`.

```angular
@if (isNotificationVisible) {
  <sbb-notification type="error" role="alert"> Please fix the form errors. </sbb-notification>
}
```
