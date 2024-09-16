We provide two sets of components designed to add side content (often
navigation, though it can be any content) alongside some primary content. These are the sidebar and
icon sidebar components.

### Utilisation of sidebars

#### General usage

It is recommended that in addition to the `<sbb-header-lean>`, the two sidebars are only used once on each view,
so that a maximum of three navigation hierarchy levels occur.
For example: `<sbb-header-lean>` > `<sbb-icon-sidebar>` > `<sbb-sidebar>` (as it is in showcase).
All sidebar components can be technically nested in any form, or they can be used individually.

#### Positioning

Both sidebars can be positioned on the left or the right side of the screen by setting the `position` attribute to
`start` or `end`. It is possible to position one `<sbb-sidebar>` on the left and another on the right side of the
screen. Only one `<sbb-icon-sidebar>` can be used at a time and may be positioned on the left _or_ right side of the
screen.

On mobile devices, the `<sbb-icon-sidebar>` is always displayed at the bottom of the screen, independent of the
`position` attribute.

## Icon Sidebar

The icon sidebar components are designed to add a primary navigation to a fullscreen app using specific icons and a label.
To set up an icon sidebar we use three components: `<sbb-icon-sidebar-container>` which acts as a structural container for our content
and icon sidebar, `<sbb-icon-sidebar-content>` which represents the main content, and `<sbb-icon-sidebar>` which
represents the added sidebar with its links.

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
    <a sbbIconSidebarItem label="Station"><sbb-icon svgIcon="station-small"></sbb-icon></a>
  </sbb-icon-sidebar>
  <sbb-icon-sidebar-content>Main</sbb-icon-sidebar-content>
</sbb-icon-sidebar-container>
```

```html
<!-- Creates a layout with an implicit content. -->
<sbb-icon-sidebar-container>
  <sbb-icon-sidebar>
    <a sbbIconSidebarItem label="Station"><sbb-icon svgIcon="station-small"></sbb-icon></a>
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
Using links you have to set the label attribute for the description because any content other than the icon within a `<a sbbIconSidebarItem></a>`-element is ignored.

To display the active state correctly, use the css class `sbb-active`.
For example if using with a routerLink, write `routerLinkActive="sbb-active"`.

#### Example with angular router

```html
<sbb-icon-sidebar-container>
  <sbb-icon-sidebar>
    <a sbbIconSidebarItem label="Station" routerLink="./link" routerLinkActive="sbb-active">
      <sbb-icon svgIcon="station-small"></sbb-icon>
    </a>
    <hr />
    <a sbbIconSidebarItem label="Other Station" routerLink="./link2" routerLinkActive="sbb-active">
      <sbb-icon svgIcon="station-small"></sbb-icon>
    </a>
  </sbb-icon-sidebar>
  <sbb-sidebar-content role="main">
    <router-outlet></router-outlet>
  </sbb-sidebar-content>
</sbb-icon-sidebar-container>
```

### Expanding and collapsing the sidebar

By default, the `<sbb-sidebar>` is displayed next to the content and cannot be collapsed.
It can be made collapsible by setting the `collapsible` attribute to `true`. In collapsible mode the sidebar is
displayed above the content and can be collapsed using the close icon, by clicking in the content are or by
pressing the escape key.

Like the normal sidebar, the collapsible sidebar is opened by default. You can close it by setting the `opened`
property to `false`. If the `opened` state is controlled with the input property, the sidebar will not be toggled
automatically if the mobile state changes.

In collapsible mode, the sidebar can have a title displayed next to the close icon. This label can be set using the
`collapsibleTitle` attribute.

```html
<sbb-sidebar-container>
  <sbb-sidebar collapsible="true">...</sbb-sidebar>
  <sbb-sidebar-content>...</sbb-sidebar-content>
</sbb-sidebar-container>
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

### Using with sbb-header-lean

If you place the `<sbb-icon-sidebar-container>` directly after the `<sbb-header-lean>`, correct styles will automatically be applied.

```html
<sbb-header-lean>...</sbb-header-lean>
<sbb-icon-sidebar-container> ... </sbb-icon-sidebar-container>
```

Whenever you add content between `<sbb-header-lean>` and `<sbb-icon-sidebar-container>` elements or wrap
either in a component/element, add the css class `sbb-icon-sidebar-after-header` to the `<sbb-icon-sidebar-container>`
(e.g. `<sbb-icon-sidebar-container class="sbb-icon-sidebar-after-header">`).

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
  <sbb-sidebar><fieldset>Sidebar</fieldset></sbb-sidebar>
  <sbb-sidebar-content>Main</sbb-sidebar-content>
</sbb-sidebar-container>
```

```html
<!-- Creates a layout with an implicit content. -->
<sbb-sidebar-container>
  <sbb-sidebar><fieldset>Sidebar</fieldset></sbb-sidebar>
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
  <sbb-sidebar><fieldset>Sidebar</fieldset></sbb-sidebar>
  <sbb-sidebar><fieldset>Sidebar2</fieldset></sbb-sidebar>
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

### Sidebar Navigation Content

Inside a `<sbb-sidebar>` it's possible to place `<sbb-expansion-panel>` and `<fieldset>` elements in which you can place every content you like.
Any different direct descendant of `<sbb-sidebar>` than the two mentioned elements are being ignored.

Primarly it is intended to place links with the attribute selector `sbbSidebarLink` inside of `<sbb-expansion-panel>` and `<fieldset>` to achieve a navigation.

To display the active state correctly, use the css class `sbb-active`.
For example if using with a routerLink, write `routerLinkActive="sbb-active"`.

#### Example with angular router

```html
<sbb-sidebar-container>
  <sbb-sidebar role="navigation">
    <sbb-expansion-panel expanded>
      <sbb-expansion-panel-header>Introduction</sbb-expansion-panel-header>
      <a sbbSidebarLink routerLink="/getting-started" routerLinkActive="sbb-active"
        >Getting Started</a
      >
      <a sbbSidebarLink routerLink="/typography" routerLinkActive="sbb-active">Typography</a>
    </sbb-expansion-panel>
    <fieldset>
      <legend>Fieldset Example</legend>
      <button type="button" sbb-button>Random Content</button>
    </fieldset>
  </sbb-sidebar>
  <sbb-sidebar-content role="main">
    <router-outlet></router-outlet>
  </sbb-sidebar-content>
</sbb-sidebar-container>
```

### Opening and closing a sidebar

A `<sbb-sidebar>` can be opened or closed using the `open()`, `close()` and `toggle()` methods. Each
of these methods returns a `Promise<boolean>` that will be resolved with `true` when the sidebar
finishes opening or `false` when it finishes closing.

The opened state can also be set via a property binding in the template using the `opened` property.
The property supports 2-way binding.

`<sbb-sidebar>` also supports output properties for just open and just close events, The `(opened)`
and `(closed)` properties respectively.

### Setting the sidebar's size

The `<sbb-sidebar>` will, by default, have an expanded width of 300px. The width can
be explicitly set via CSS:

```css
.sbb-sidebar {
  width: 250px;
}
```

If you like fit the size of its content, just set css `width` to `auto`.

Try to avoid percent based width as `resize` events are not (yet) supported.

### Using with sbb-header-lean

If you place the `<sbb-sidebar-container>` directly after the `<sbb-header-lean>`, correct styles will automatically be applied.

```html
<sbb-header-lean>...</sbb-header-lean> <sbb-sidebar-container> ... </sbb-sidebar-container>
```

Whenever you add content between `<sbb-header-lean>` and `<sbb-sidebar-container>` elements or wrap
either in a component/element, add the css class `sbb-sidebar-after-header` to the `<sbb-sidebar-container>`
(e.g. `<sbb-sidebar-container class="sbb-sidebar-after-header">`).

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

The `<sbb-sidebar>` and `<sbb-sidebar-content>` should each be given an appropriate `role` attribute
depending on the context in which they are used.

For example, a `<sbb-sidebar>` that contains links
to other pages might be marked `role="navigation"`, whereas one that contains a table of
contents about might be marked as `role="directory"`. If there is no more specific role that
describes your sidebar, `role="region"` is recommended.

Similarly, the `<sbb-sidebar-content>` should be given a role based on what it contains. If it
represents the primary content of the page, it may make sense to mark it `role="main"`. If no more
specific role makes sense, `role="region"` is again a good fallback.

#### Focus management

The sidebar has the ability to capture focus. This behavior is turned on for mobile devices and it is off for desktop devices.

By default the first tabbable element will receive focus upon open. If you want a different element to be focused, you can set the `cdkFocusInitial` attribute on it.
