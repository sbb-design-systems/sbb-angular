`<sbb-menu>` is a floating panel containing list of options.

```html
<button [sbbMenuTriggerFor]="menu" aria-label="Show actions" type="button">
  <sbb-icon *sbbMenuDynamicTrigger svgIcon="kom:context-menu-small"></sbb-icon>
</button>
<sbb-menu #menu="sbbMenu">
  <button sbb-menu-item type="button">Copy</button>
  <button sbb-menu-item type="button">Delete</button>
  <hr />
  <button sbb-menu-item type="button">Cancel</button>
</sbb-menu>
```

### Trigger

By itself, the `<sbb-menu>` element does not render anything. The menu is attached to and opened
via application of the `sbbMenuTriggerFor` directive.
Ideally the trigger directive is applied to a button. The content of the trigger should be wrapped
with `<ng-template sbbMenuDynamicTrigger>` or `<sbb-icon *sbbMenuDynamicTrigger svgIcon="...">`.

Due to the way some menu occurrences are designed we need to copy the trigger content into the overlay panel.
If `sbbMenuDynamicTrigger` is not used in these cases, the trigger content is copied as-is.
This uses the DomSanitizer in the background, which has consequences when enforcing
[trusted types](https://angular.io/guide/security#enforcing-trusted-types).
Due to this reason we recommend to always use the template (`<ng-template sbbMenuDynamicTrigger>`)
or structural directive (`<sbb-icon *sbbMenuDynamicTrigger svgIcon="...">`) for the trigger content.

### Toggling the menu programmatically

The menu exposes an API to open/close programmatically. Please note that in this case, an
`sbbMenuTriggerFor` directive is still necessary to attach the menu to a trigger element in the DOM.

```ts
class MyComponent {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;

  someMethod() {
    this.trigger.openMenu();
  }
}
```

### Icons

Menus support displaying `sbb-icon` elements before the menu item text.

### Nested menu

Sbb Angular supports the ability for an `sbb-menu-item` to open a sub-menu. To do so, you have to define
your root menu and sub-menus, in addition to setting the `[sbbMenuTriggerFor]` on the `sbb-menu-item`
that should trigger the sub-menu:

```html
<sbb-menu #animals="sbbMenu">
  <button sbb-menu-item [sbbMenuTriggerFor]="vertebrates" type="button">Vertebrates</button>
  <button sbb-menu-item [sbbMenuTriggerFor]="invertebrates" type="button">Invertebrates</button>
</sbb-menu>

<sbb-menu #vertebrates="sbbMenu">
  <button sbb-menu-item [sbbMenuTriggerFor]="fish" type="button">Fishes</button>
  <button sbb-menu-item [sbbMenuTriggerFor]="amphibians" type="button">Amphibians</button>
  <button sbb-menu-item [sbbMenuTriggerFor]="reptiles" type="button">Reptiles</button>
  <button sbb-menu-item type="button">Birds</button>
  <button sbb-menu-item type="button">Mammals</button>
</sbb-menu>
```

### Lazy rendering

By default, the menu content will be initialized even when the panel is closed. To defer
initialization until the menu is open, the content can be provided as an `ng-template`
with the `sbbMenuContent` attribute:

```html
<sbb-menu #appMenu="sbbMenu">
  <ng-template sbbMenuContent>
    <button sbb-menu-item type="button">Settings</button>
    <button sbb-menu-item type="button">Help</button>
  </ng-template>
</sbb-menu>
```

### Passing in data to a menu

When using lazy rendering, additional context data can be passed to the menu panel via
the `sbbMenuTriggerData` input. This allows for a single menu instance to be rendered
with a different set of data, depending on the trigger that opened it:

```html
<button
  [sbbMenuTriggerFor]="appMenu"
  [sbbMenuTriggerData]="{name: 'Alice'}"
  aria-label="Show actions"
  type="button"
>
  <sbb-icon *sbbMenuDynamicTrigger svgIcon="kom:context-menu-small"></sbb-icon>
</button>

<button
  [sbbMenuTriggerFor]="appMenu"
  [sbbMenuTriggerData]="{name: 'Bob'}"
  aria-label="Show actions"
  type="button"
>
  <sbb-icon *sbbMenuDynamicTrigger svgIcon="kom:context-menu-small"></sbb-icon>
</button>

<sbb-menu #appMenu="sbbMenu">
  <ng-template sbbMenuContent let-name="name">
    <button sbb-menu-item type="button">Settings</button>
    <button sbb-menu-item type="button">Logout {{name}}</button>
  </ng-template>
</sbb-menu>
```

### Keyboard interaction

- <kbd>DOWN_ARROW</kbd>: Focuses the next menu item
- <kbd>UP_ARROW</kbd>: Focuses previous menu item
- <kbd>RIGHT_ARROW</kbd>: Opens the menu item's sub-menu
- <kbd>LEFT_ARROW</kbd>: Closes the current menu, if it is a sub-menu
- <kbd>ENTER</kbd>: Activates the focused menu item
- <kbd>ESCAPE</kbd>: Closes the menu

### Accessibility

Menu triggers or menu items without text or labels should be given a meaningful label via
`aria-label` or `aria-labelledby`.
