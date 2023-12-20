Tabs organize content into separate views where only one view can be
visible at a time. Each tab's label is shown in the tab header and the active
tab's label is designated with the animated bar. When the list of tab labels exceeds the width
of the header, it will become scrollable.

The active tab may be set using the `selectedIndex` on `sbb-tab-group`, or when the user selects one of the
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
    <sbb-icon svgIcon="user-group-small" class="example-tab-icon"></sbb-icon>
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
<nav sbb-tab-nav-bar [tabPanel]="tabPanel">
  @for (link of links; track link) {
  <a
    sbb-tab-link
    [routerLink]="link.routerLink"
    routerLinkActive
    #rla="routerLinkActive"
    [active]="rla.isActive"
  >
    {{ link.label }}
  </a>
  }
  <a sbb-tab-link disabled>Disabled Link</a>
</nav>

<sbb-tab-nav-panel #tabPanel>
  <router-outlet></router-outlet>
</sbb-tab-nav-panel>
```

The `sbb-tab-nav-bar` is not tied to any particular router; it works with normal `<a>` elements and
uses the `active` property to determine which tab is currently active. The corresponding
`<router-outlet>` must be wrapped in an `<sbb-tab-nav-panel>` component and should typically be
placed relatively close to the `sbb-tab-nav-bar` (see [Accessibility](#accessibility)).

Note: If the link is not wrapped in an `ngFor` directive, the `routerLinkActive` reference (`#rla`)
needs to be unique for each link (e.g. `rla1`, `rla2` etc.).

### Lazy Loading

By default, the tab contents are eagerly loaded. Eagerly loaded tabs
will initialize the child components but not inject them into the DOM
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

### Controlling the tab animation

You can control the duration of the tabs' animation using the `animationDuration` input. If you
want to disable the animation completely, you can do so by setting the properties to `0ms`. The
duration can be configured globally using the `SBB_TABS_CONFIG` injection token.

```html
<sbb-tab-group animationDuration="2000ms"></sbb-tab-group>
```

### Keeping the tab content inside the DOM while it's off-screen

By default the `<sbb-tab-group>` will remove the content of off-screen tabs from the DOM until they
come into the view. This is optimal for most cases since it keeps the DOM size smaller, but it
isn't great for others like when a tab has an `<audio>` or `<video>` element, because the content
will be re-initialized whenever the user navigates to the tab. If you want to keep the content of
off-screen tabs in the DOM, you can set the `preserveContent` input to `true`.

```html
<sbb-tab-group preserveContent>
  <sbb-tab label="First">
    <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/B-lipaiZII8"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </sbb-tab>
  <sbb-tab label="Second">Note how the video from the previous tab is still playing.</sbb-tab>
</sbb-tab-group>
```

### Accessibility

`SbbTabGroup` and `SbbTabNavBar` both implement the
[ARIA Tabs design pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel). Both components
compose `tablist`, `tab`, and `tabpanel` elements with handling for keyboard inputs and focus
management.

When using `SbbTabNavBar`, you should place the `<sbb-tab-nav-panel>` component relatively close to
if not immediately adjacent to the `<nav sbb-tab-nav-bar>` component so that it's easy for screen
reader users to identify the association.

#### Labels

Always provide an accessible label via `aria-label` or `aria-describedby` for tabs without
descriptive text content.

When using `SbbTabNavGroup`, always specify a label for the `<nav>` element.

#### Keyboard interaction

`SbbTabGroup` and `SbbTabNavBar` both implement the following keyboard interactions:

| Shortcut           | Action                     |
| ------------------ | -------------------------- |
| `LEFT_ARROW`       | Move focus to previous tab |
| `RIGHT_ARROW`      | Move focus to next tab     |
| `HOME`             | Move focus to first tab    |
| `END`              | Move focus to last tab     |
| `SPACE` or `ENTER` | Switch to focused tab      |
