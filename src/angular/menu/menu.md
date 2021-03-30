`<sbb-menu>` is a floating panel containing list of options.

<!-- example(menu-overview) -->

By itself, the `<sbb-menu>` element does not render anything. The menu is attached to and opened
via application of the `sbbMenuTriggerFor` directive:

<!-- example({"example": "menu-overview",
              "file": "menu-overview-example.html",
              "region": "sbb-menu-trigger-for"}) -->

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

<!-- example({"example": "menu-icons",
              "file": "menu-icons-example.html"}) -->

### Customizing menu position

By default, the menu will display below (y-axis), after (x-axis), with overlapping
its trigger. The position can be changed using the `xPosition` (`before | after`) and `yPosition`
(`above | below`) attributes. The menu can be forced to not overlap the trigger using the
`overlapTrigger` attribute.

<!-- example({"example": "menu-position",
              "file": "menu-position-example.html",
              "region": "menu-position"}) -->

### Nested menu

Sbb Angular supports the ability for an `sbb-menu-item` to open a sub-menu. To do so, you have to define
your root menu and sub-menus, in addition to setting the `[sbbMenuTriggerFor]` on the `sbb-menu-item`
that should trigger the sub-menu:

<!-- example({"example": "menu-nested",
              "file": "menu-nested-example.html",
              "region": "sub-menu"}) -->

### Lazy rendering

By default, the menu content will be initialized even when the panel is closed. To defer
initialization until the menu is open, the content can be provided as an `ng-template`
with the `sbbMenuContent` attribute:

```html
<sbb-menu #appMenu="sbbMenu">
  <ng-template sbbMenuContent>
    <button sbb-menu-item>Settings</button>
    <button sbb-menu-item>Help</button>
  </ng-template>
</sbb-menu>

<button sbb-icon-button [sbbMenuTriggerFor]="appMenu">
  <sbb-icon>more_vert</sbb-icon>
</button>
```

### Passing in data to a menu

When using lazy rendering, additional context data can be passed to the menu panel via
the `sbbMenuTriggerData` input. This allows for a single menu instance to be rendered
with a different set of data, depending on the trigger that opened it:

```html
<sbb-menu #appMenu="sbbMenu">
  <ng-template sbbMenuContent let-name="name">
    <button sbb-menu-item>Settings</button>
    <button sbb-menu-item>Log off {{name}}</button>
  </ng-template>
</sbb-menu>

<button sbb-icon-button [sbbMenuTriggerFor]="appMenu" [sbbMenuTriggerData]="{name: 'Sally'}">
  <sbb-icon>more_vert</sbb-icon>
</button>

<button sbb-icon-button [sbbMenuTriggerFor]="appMenu" [sbbMenuTriggerData]="{name: 'Bob'}">
  <sbb-icon>more_vert</sbb-icon>
</button>
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
