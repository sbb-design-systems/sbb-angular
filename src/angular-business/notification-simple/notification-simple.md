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

### Custom Icon

It is also possible to send a notification message with a custom icon as seen below

```html
<ng-template #anotherIcon>
  <sbb-icon-clock></sbb-icon-clock>
</ng-template>
```

```typescript
@ViewChild('anotherIcon', { read: TemplateRef, static: true })
anotherIcon: TemplateRef<any>;

open() {
    this._notification.open('test', {
      icon: this.anotherIcon,
    });
}
```

### Jump Marks

It is possible to provide a list of jump marks to the notification, which will be
displayed with links to the given element ids. An additional callback can be provided to execute a function upon jumpmark click.

```ts
export interface JumpMark {
  /** Title of an element in jump marks. */
  title: string;
  /** Identifier of an element in jump marks. */
  elementId?: string;
  /** Callback function for the jumpmark */
  callback?: (event$: any, jumpMark: JumpMark) => void;
}
```

```typescript
this._notification.open('text', {
  jumpMarks: [
    { elementId: '#tip1', title: 'Tip 1' },
    { elementId: '#tip2', title: 'Tip 2' },
  ],
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
