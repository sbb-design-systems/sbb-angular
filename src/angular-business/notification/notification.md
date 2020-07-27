You can use the notification component to send a simple message:

```html
<h4 id="default">Default success notification</h4>
<sbb-notification message="Suchen" type="success"></sbb-notification>
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
  <sbb-icon-clock *sbbIcon></sbb-icon-clock>
</sbb-notification>
```

# Toast notification

You can use the notification-simple component to show a notification at the top or bottom center of the window:

```typescript
  constructor(private _notification: Notification) {}

  open() {
    this._notification.open('test');
  }
```

## Configuration

### Notification type

There are four types of notifications:

- success
- info
- error
- warning

```typescript
this._notification.open('test', {
  type: 'info',
});
```

### Notification position

A notification can be positioned either at the top or bottom of the window:

```typescript
this._notification.open('test', {
  verticalPosition: 'top',
});
```

### Notification duration

It is also possible to define a notificaiton duration (in milliseconds), after which the notification is automatically dismissed.

```typescript
this._notification.open('test', {
  duration: 3000,
});
```

## Notification from Template

To add a simple styling to the notification content, you can open a notification from a template:

```typescript
this._notification.openFromTemplate('<strong>Template content</strong>');
```

## Notification from Component

You can also display the notification content using a Component, which gives you the ability to define your own styles and functionalities within the notification content.

```typescript
this._notification.openFromComponent(ExampleComponent);
```

```typescript
@Component({
  selector: 'sbb-component-example',
  template: `<span class="example-style">
    SBB CFF FFS
  </span>`,
  styles: [
    `
      .example-style {
        color: darkred;
      }
    `,
  ],
})
export class ExampleComponent {}
```
