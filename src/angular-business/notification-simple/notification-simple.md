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

### Duration

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
