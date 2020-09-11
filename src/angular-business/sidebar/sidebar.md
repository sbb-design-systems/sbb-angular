Sbb angular provides two sets of components designed to add side content (often
navigation, though it can be any content) alongside some primary content. These are the sidebar and
icon sidebar components.

### Utilisation of sidebars

It is intended that in addition to the `<sbb-header>`, the two sidebars are only used once on each view,
so that a maximum of three navigation hierarchy levels occur.
For example: `<sbb-header>` > `<sbb-icon-sidebar>` > `<sbb-sidebar>` (as it is in showcase).
All sidebar components can be technically nested in any form, or they can be used individually.

## Icon Sidebar

The icon sidebar components are designed to add a primary navigation to a fullscreen app using specific icons and a label.
To set up an icon sidebar we use three components: `<sbb-icon-sidebar-container>` which acts as a structural container for our content
and icon sidebar, `<sbb-icon-sidebar-content>` which represents the main content, and `<sbb-icon-sidebar>` which
represents the added side content.

### Specifying the main and side content

Both the main and side content should be placed inside of the `<sbb-icon-sidebar-container>`, content
that you don't want to be affected by the sidebar, such as a header or footer, can be placed outside
of the container.

The side content should be wrapped in a `<sbb-icon-sidebar>` element. A
`<sbb-icon-sidebar-container>` can only have one `<sbb-icon-sidebar>` element.
The `<sbb-icon-sidebar>` must be placed as an immediate child of the `<sbb-icon-sidebar-container>`.

The main content should be wrapped in a `<sbb-icon-sidebar-content>`. If no `<sbb-icon-sidebar-content>` is
specified for a `<sbb-icon-sidebar-container>`, one will be created implicitly and all of the content
inside the `<sbb-icon-sidebar-container>` other than the `<sbb-icon-sidebar>` elements will be placed inside
of it.

The following are examples of valid icon sidebar layouts:

```html
<!-- Creates a layout with an explicit content. -->
<sbb-icon-sidebar-container>
  <sbb-icon-sidebar>
    <a sbbIconSidebarItem label="Station"><sbb-icon svgIcon="kom:station-small"></sbb-icon></a>
  </sbb-icon-sidebar>
  <sbb-icon-sidebar-content>Main</sbb-icon-sidebar-content>
</sbb-icon-sidebar-container>
```

```html
<!-- Creates a layout with an implicit content. -->
<sbb-icon-sidebar-container>
  <sbb-icon-sidebar>
    <a sbbIconSidebarItem label="Station"><sbb-icon svgIcon="kom:station-small"></sbb-icon></a>
  </sbb-icon-sidebar>
  <section>Main</section>
</sbb-icon-sidebar-container>
```

```html
<!-- Creates an empty sidebar container with no sidebars and implicit empty content. -->
<sbb-icon-sidebar-container></sbb-icon-sidebar-container>
```

And these are examples of invalid icon sidebar layouts:

```html
<!-- Invalid because there are two `<sbb-icon-sidebar>` elements -->
<sbb-icon-sidebar-container>
  <sbb-icon-sidebar>Sidebar</sbb-icon-sidebar>
  <sbb-icon-sidebar>Sidebar 2</sbb-icon-sidebar>
</sbb-icon-sidebar-container>
```

```html
<!-- Invalid because there are multiple `<sbb-icon-sidebar-content>` elements. -->
<sbb-icon-sidebar-container>
  <sbb-icon-sidebar-content>Main</sbb-icon-sidebar-content>
  <sbb-icon-sidebar-content>Main 2</sbb-icon-sidebar-content>
</sbb-icon-sidebar-container>
```

```html
<!-- Invalid because the `<sbb-icon-sidebar>` is outside of the `<sbb-icon-sidebar-container>`. -->
<sbb-icon-sidebar-container></sbb-icon-sidebar-container>
<sbb-icon-sidebar></sbb-icon-sidebar>
```

### Sidebar Links

Inside a `<sbb-icon-sidebar>` it's possible to place links containing the attribute selector `sbbIconSidebarItem`
and `<hr>` elements to separate links from each other. Any different element than the two mentioned are ignored.
Using links you have to set the label attribute for the description because any content other than the icon within a `<a sbbIconSidebarItem></a>` is ignored.

To display the active state correctly, use the css class `sbb-icon-sidebar-item-active`.
For example if using with a routerLink, write `routerLinkActive="sbb-icon-sidebar-item-active"`.

#### Example with angular router

```html
<sbb-icon-sidebar-container>
  <sbb-icon-sidebar>
    <a
      sbbIconSidebarItem
      label="Station"
      routerLink="./link"
      routerLinkActive="sbb-icon-sidebar-item-active"
    >
      <sbb-icon svgIcon="kom:station-small"></sbb-icon>
    </a>
    <hr />
    <a
      sbbIconSidebarItem
      label="Other Station"
      routerLink="./link2"
      routerLinkActive="sbb-icon-sidebar-item-active"
    >
      <sbb-icon svgIcon="kom:station-small"></sbb-icon>
    </a>
  </sbb-icon-sidebar>
  <sbb-sidebar-content role="main">
    <router-outlet></router-outlet>
  </sbb-sidebar-content>
</sbb-icon-sidebar-container>
```

### Expanding and collapsing an icon sidebar

An `<sbb-icon-sidebar>` can be expanded or collapsed using the `toggleExpanded(expanded: boolean)` method.

The expanded state can also be set via a property binding in the template using the `expanded` property.
The property supports 2-way binding.

In the mobile view, the icon sidebar is always collapsed.

### Setting the icon sidebar's expanded size

The `<sbb-icon-sidebar>` will, by default, have an expanded width of 250px. The width can
be explicitly set via CSS:

```css
.sbb-icon-sidebar.sbb-icon-sidebar-expanded {
  width: 300px;
}
```

### Using with sbb header

If you like to use the icon sidebar after the `<sbb-header>`, please
apply the css class `sbb-icon-sidebar-after-header` to the `<sbb-icon-sidebar-container>`.

```html
<sbb-header>...</sbb-header>
<sbb-icon-sidebar-container class="sbb-icon-sidebar-after-header">
  ...
</sbb-icon-sidebar-container>
```

### Reacting to scroll events inside the sidebar container

To react to scrolling inside the `<sbb-icon-sidebar-container>`, you can get a hold of the underlying
`CdkScrollable` instance through the `sbbSidebarContainer`.

```ts
class YourComponent implements AfterViewInit {
  @ViewChild(sbbIconSidebarContainer) sidebarContainer: sbbIconSidebarContainer;

  ngAfterViewInit() {
    this.sidebarContainer.scrollable.elementScrolled().subscribe(() => /* react to scrolling */);
  }
}
```

### Accessibility

The `<sbb-sidebar-content>` should be given a role based on what it contains. If it
represents the primary content of the page, it may make sense to mark it `role="main"`. If no more
specific role makes sense, `role="region"` is again a good fallback.

If there is not enough space for link labels, they are becoming clipped and complemented with ellipsis.
To provide full length label to the user, use either the `title`-attribute or the sbb tooltip.

## Sidebar

The sidebar components are designed to add side content to a fullscreen app. To set up a sidebar we
use three components: `<sbb-sidebar-container>` which acts as a structural container for our content
and sidebar, `<sbb-sidebar-content>` which represents the main content, and `<sbb-sidebar>` which
represents the added side content.

The drawer component is designed to add side content to a small section of your app. This is
accomplished using the `<sbb-drawer-container>`, `<sbb-drawer-content>`, and `<sbb-drawer>`
components, which are analogous to their sidebar equivalents. Rather than adding side content to the
app as a whole, these are designed to add side content to a small section of your app. They support
almost all of the same features, but do not support fixed positioning.

### Specifying the main and side content

Both the main and side content should be placed inside of the `<sbb-sidebar-container>`, content
that you don't want to be affected by the sidebar, such as a header or footer, can be placed outside
of the container.

The side content should be wrapped in a `<sbb-sidebar>` element. A
`<sbb-sidebar-container>` can only have one `<sbb-sidebar>` element. The `<sbb-sidebar>` must be placed as an immediate child of the `<sbb-sidebar-container>`.

The main content should be wrapped in a `<sbb-sidebar-content>`. If no `<sbb-sidebar-content>` is
specified for a `<sbb-sidebar-container>`, one will be created implicitly and all of the content
inside the `<sbb-sidebar-container>` other than the `<sbb-sidebar>` elements will be placed inside
of it.

The following are examples of valid sidebar layouts:

```html
<!-- Creates a layout with an explicit content. -->
<sbb-sidebar-container>
  <sbb-sidebar>Sidebar</sbb-sidebar>
  <sbb-sidebar-content>Main</sbb-sidebar-content>
</sbb-sidebar-container>
```

```html
<!-- Creates a layout with an implicit content. -->
<sbb-sidebar-container>
  <sbb-sidebar>Sidebar</sbb-sidebar>
  <section>Main</section>
</sbb-sidebar-container>
```

```html
<!-- Creates an empty sidebar container with no sidebars and implicit empty content. -->
<sbb-sidebar-container></sbb-sidebar-container>
```

And these are examples of invalid sidebar layouts:

```html
<!-- Invalid because there are two `<sbb-sidebar>` elements -->
<sbb-sidebar-container>
  <sbb-sidebar>Sidebar</sbb-sidebar>
  <sbb-sidebar>Sidebar 2</sbb-sidebar>
</sbb-sidebar-container>
```

```html
<!-- Invalid because there are multiple `<sbb-sidebar-content>` elements. -->
<sbb-sidebar-container>
  <sbb-sidebar-content>Main</sbb-sidebar-content>
  <sbb-sidebar-content>Main 2</sbb-sidebar-content>
</sbb-sidebar-container>
```

```html
<!-- Invalid because the `<sbb-sidebar>` is outside of the `<sbb-sidebar-container>`. -->
<sbb-sidebar-container></sbb-sidebar-container>
<sbb-sidebar></sbb-sidebar>
```

These same rules all apply to the drawer components as well.

### Opening and closing a sidebar

A `<sbb-sidebar>` can be opened or closed using the `open()`, `close()` and `toggle()` methods. Each
of these methods returns a `Promise<boolean>` that will be resolved with `true` when the sidebar
finishes opening or `false` when it finishes closing.

The opened state can also be set via a property binding in the template using the `opened` property.
The property supports 2-way binding.

`<sbb-sidebar>` also supports output properties for just open and just close events, The `(opened)`
and `(closed)` properties respectively.

All of these properties and methods work on `<sbb-drawer>` as well.

### Changing the sidebar's behavior

The `<sbb-sidebar>` can render in one of three different ways based on the `mode` property.

| Mode   | Description                                                                                                           |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| `over` | Sidenar floats over the primary content, which is covered by a backdrop                                               |
| `push` | Sidenar pushes the primary content out of its way, also covering it with a backdrop                                   |
| `side` | Sidenar appears side-by-side with the main content, shrinking the main content's width to make space for the sidebar. |

If no `mode` is specified, `over` is used by default.

The `over` and `push` sidebar modes show a backdrop by default, while the `side` mode does not. This
can be customized by setting the `hasBackdrop` property on `sbb-sidebar-container`. Explicitly
setting `hasBackdrop` to `true` or `false` will override the default backdrop visibility setting for
all sidebars regadless of mode. Leaving the property unset or setting it to `null` will use the
default backdrop visibility for each mode.

`<sbb-drawer>` also supports all of these same modes and options.

### Disabling automatic close

Clicking on the backdrop or pressing the <kbd>Esc</kbd> key will normally close an open sidebar.
However, this automatic closing behavior can be disabled by setting the `disableClose` property on
the `<sbb-sidebar>` or `<sbb-drawer>` that you want to disable the behavior for.

Custom handling for <kbd>Esc</kbd> can be done by adding a keydown listener to the `<sbb-sidebar>`.
Custom handling for backdrop clicks can be done via the `(backdropClick)` output property on
`<sbb-sidebar-container>`.

### Resizing an open sidebar

By default, sbb angular will only measure and resize the drawer container in a few key moments
(on open, on window resize, on mode change) in order to avoid layout thrashing, however there
are cases where this can be problematic. If your app requires for a drawer to change its width
while it is open, you can use the `autosize` option to tell sbb angular to continue measuring it.
Note that you should use this option **at your own risk**, because it could cause performance
issues.

### Setting the sidebar's size

The `<sbb-sidebar>` and `<sbb-drawer>` will, by default, fit the size of its content. The width can
be explicitly set via CSS:

```css
sbb-sidebar {
  width: 250px;
}
```

Try to avoid percent based width as `resize` events are not (yet) supported.

### Fixed position sidebars

For `<sbb-sidebar>` only (not `<sbb-drawer>`) fixed positioning is supported. It can be enabled by
setting the `fixedInViewport` property. Additionally, top and bottom space can be set via the
`fixedTopGap` and `fixedBottomGap`. These properties accept a pixel value amount of space to add at
the top or bottom.

### Creating a responsive layout for mobile & desktop

A sidebar often needs to behave differently on a mobile vs a desktop display. On a desktop, it may
make sense to have just the content section scroll. However, on mobile you often want the body to be
the element that scrolls; this allows the address bar to auto-hide. The sidebar can be styled with
CSS to adjust to either type of device.

### Reacting to scroll events inside the sidebar container

To react to scrolling inside the `<sbb-sidebar-container>`, you can get a hold of the underlying
`CdkScrollable` instance through the `sbbSidebarContainer`.

```ts
class YourComponent implements AfterViewInit {
  @ViewChild(sbbSidebarContainer) sidebarContainer: sbbSidebarContainer;

  ngAfterViewInit() {
    this.sidebarContainer.scrollable.elementScrolled().subscribe(() => /* react to scrolling */);
  }
}
```

### Accessibility

The `<sbb-sidebar>` an `<sbb-sidebar-content>` should each be given an appropriate `role` attribute
depending on the context in which they are used.

For example, a `<sbb-sidebar>` that contains links
to other pages might be marked `role="navigation"`, whereas one that contains a table of
contents about might be marked as `role="directory"`. If there is no more specific role that
describes your sidebar, `role="region"` is recommended.

Similarly, the `<sbb-sidebar-content>` should be given a role based on what it contains. If it
represents the primary content of the page, it may make sense to mark it `role="main"`. If no more
specific role makes sense, `role="region"` is again a good fallback.

#### Focus management

The sidebar has the ability to capture focus. This behavior is turned on for the `push` and `over` modes and it is off for `side` mode. You can change its default behavior by the `autoFocus` input.

By default the first tabbable element will recieve focus upon open. If you want a different element to be focused, you can set the `cdkFocusInitial` attribute on it.
