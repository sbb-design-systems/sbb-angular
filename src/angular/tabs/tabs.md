Tabs organize content into separate views where only one view can be
visible at a time. Each tab's label is shown in the tab header and the active
tab's label is designated with the animated bar. When the list of tab labels exceeds the width
of the header, it will become scrollable.

The active tab may be set using the `selectedIndex` input or when the user selects one of the
tab labels in the header.

```html
<sbb-tab-group>
  <sbb-tab label="First">Content 1</sbb-tab>
  <sbb-tab label="Second">Content 2</sbb-tab>
  <sbb-tab label="Third">Content 3</sbb-tab>
</sbb-tab-group>
```

### Events

The `selectedTabChange` output event is emitted when the active tab changes.

The `focusChange` output event is emitted when the user puts focus on any of the tab labels in
the header, usually through keyboard navigation.

### Labels

If a tab's label is only text then the simple tab-group API can be used.

```html
<sbb-tab label="Basic label">...</sbb-tab>
```

For more complex labels, add a template with the `sbb-tab-label` directive inside the `sbb-tab`.

```html
<sbb-tab>
  <ng-template sbb-tab-label>
    User groups
    <sbb-icon svgIcon="kom:user-group-small" class="example-tab-icon"></sbb-icon>
  </ng-template>
</sbb-tab>
```

#### Label badges

It is possible to use the [Badge Module](/angular/components/badge) with the tab labels. To use
it, the `SbbBadgeModule` must be added to the imported modules.

```html
<sbb-tab>
  <span *sbb-tab-label sbbBadge="5">Messages</span>
</sbb-tab>
```

### Dynamic Height

By default, the tab group will not change its height to the height of the currently active tab. To
change this, set the `dynamicHeight` input to true. The tab body will animate its height according
to the height of the active tab.

```html
<sbb-tab-group dynamicHeight></sbb-tab-group>
```

### Tabs and navigation

While `<sbb-tab-group>` is used to switch between views within a single route, `<nav sbb-tab-nav-bar>`
provides a tab-like UI for navigating between routes.

```html
<nav sbb-tab-nav-bar>
  <a
    sbb-tab-link
    *ngFor="let link of links"
    [routerLink]="link.routerLink"
    routerLinkActive
    #rla="routerLinkActive"
    [active]="rla.isActive"
  >
    {{link.label}}
  </a>
  <a sbb-tab-link disabled>Disabled Link</a>
</nav>

<!-- The wrapping div with the css class 'sbb-tab-nav-bar-body' is only required for the lean design -->
<div class="sbb-tab-nav-bar-body">
  <router-outlet></router-outlet>
</div>
```

The `tab-nav-bar` is not tied to any particular router; it works with normal `<a>` elements and uses
the `active` property to determine which tab is currently active. The corresponding
`<router-outlet>` can be placed anywhere in the view.

### Lazy Loading

By default, the tab contents are eagerly loaded. Eagerly loaded tabs
will initalize the child components but not inject them into the DOM
until the tab is activated.

If the tab contains several complex child components or the tab's contents
rely on DOM calculations during initialization, it is advised
to lazy load the tab's content.

Tab contents can be lazy loaded by declaring the body in a `ng-template`
with the `sbbTabContent` attribute.

```html
<sbb-tab label="First">
  <ng-template sbbTabContent>
    Content 1 - Loaded: {{getTimeLoaded(1) | date:'medium'}}
  </ng-template>
</sbb-tab>
```

### Accessibility

`<sbb-tab-group>` and `<sbb-nav-tab-bar>` use different interaction patterns. The
`<sbb-tab-group>` component combines `tablist`, `tab`, and `tabpanel` into a single component with
the appropriate keyboard shortcuts. The `<sbb-nav-tab-bar>`, however, use a _navigation_ interaction
pattern by using a `<nav>` element with anchor elements as the "tabs". The difference
between these two patterns comes from the fact one updates the page URL while the other does not.

#### Labels

Tabs without text or labels should be given a meaningful label via `aria-label` or
`aria-labelledby`. For `SbbTabNav`, the `<nav>` element should have a label as well.

#### Keyboard interaction

| Shortcut           | Action                     |
| ------------------ | -------------------------- |
| `LEFT_ARROW`       | Move focus to previous tab |
| `RIGHT_ARROW`      | Move focus to next tab     |
| `HOME`             | Move focus to first tab    |
| `END`              | Move focus to last tab     |
| `SPACE` or `ENTER` | Switch to focused tab      |
