`<sbb-menu>` is a floating panel containing list of options.

```html
<button [sbbContextmenuTriggerFor]="menu" aria-label="Show actions" type="button"></button>
<sbb-menu #menu="sbbMenu">
  <button sbb-menu-item type="button">Copy</button>
  <button sbb-menu-item type="button">Delete</button>
  <hr />
  <button sbb-menu-item type="button">Cancel</button>
</sbb-menu>
```

### Trigger

By itself, the `<sbb-menu>` element does not render anything. The menu is attached to and opened
via application of the `sbbMenuTriggerFor` or `sbbContextmenuTriggerFor` directive.
The `sbbContextmenuTriggerFor` directive is a shortcut for a standard contextmenu and the best choice for most of the use cases.

If using `sbbMenuTriggerFor` please consider the following notes.
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
`sbbMenuTriggerFor` or `sbbContextmenuTriggerFor` directive is still necessary to attach the menu to a trigger element in the DOM.

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
  [sbbContextmenuTriggerFor]="appMenu"
  [sbbMenuTriggerData]="{name: 'Alice'}"
  aria-label="Show actions"
  type="button"
></button>

<button
  [sbbContextmenuTriggerFor]="appMenu"
  [sbbMenuTriggerData]="{name: 'Bob'}"
  aria-label="Show actions"
  type="button"
></button>

<sbb-menu #appMenu="sbbMenu">
  <ng-template sbbMenuContent let-name="name">
    <button sbb-menu-item type="button">Settings</button>
    <button sbb-menu-item type="button">Logout {{name}}</button>
  </ng-template>
</sbb-menu>
```

### Keyboard interaction

| Keyboard shortcut      | Action                                      |
| ---------------------- | ------------------------------------------- |
| <kbd>Down Arrow</kbd>  | Focus the next menu item.                   |
| <kbd>Up Arrow</kbd>    | Focus the previous menu item.               |
| <kbd>Left Arrow</kbd>  | Close the current menu if it is a sub-menu. |
| <kbd>Right Arrow</kbd> | Opens the current menu item's sub-menu.     |
| <kbd>Enter</kbd>       | Activate the focused menu item.             |
| <kbd>Escape</kbd>      | Close all open menus.                       |

### Accessibility

Sbb Angular's menu component consists of two connected parts: the trigger and the pop-up menu.

The menu trigger is a standard button element augmented with `aria-haspopup`, `aria-expanded`, and
`aria-controls` to create the relationship to the pop-up panel.

The pop-up menu implements the `role="menu"` pattern, handling keyboard interaction and focus
management. Upon opening, the trigger will focus the first focusable menu item. Upon close, the menu
will return focus to its trigger. Avoid creating a menu in which all items are disabled, instead
hiding or disabling the menu trigger.

Sbb Angular does not support the `menuitemcheckbox` or `menuitemradio` roles.

Always provide an accessible label via `aria-label` or `aria-labelledby` for any menu
triggers or menu items without descriptive text content.
