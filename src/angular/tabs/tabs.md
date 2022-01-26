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
<nav sbb-tab-nav-bar [tabPanel]="tabPanel">
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

<sbb-tab-nav-panel #tabPanel>
  <router-outlet></router-outlet>
</sbb-tab-nav-panel>
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

`SbbTabGroup` and `SbbTabNavBar` implement different interaction patterns for different use-cases.
You should choose the component that works best for your application.

`SbbTabGroup` combines `tablist`, `tab`, and `tabpanel` into a single component with
handling for keyboard inputs and focus management. You should use this component for switching
between content within a single page.

`SbbTabNavBar`, implements a navigation interaction pattern by using a `<nav>` element with anchor
elements as the "tabs". You should use this component when you want your cross-page navigation to
look like a tabbed interface. As a rule of thumb, you should consider `SbbTabNavBar` if changing
tabs would change the browser URL. For all navigation, including with `SbbTabNavBar`, always move
browser focus to an element at the beginning of the content to which the user is navigating.
Furthermore, consider placing your `<router-outlet>` inside of a
[landmark region](https://www.w3.org/TR/wai-aria-1.1/#dfn-landmark) appropriate to the page.

Avoid mixing both `SbbTabGroup` and `SbbTabNavBar` in your application. The inconsistent interaction
patterns applied between the components may confuse users.

#### Labels

Always provide an accessible label via `aria-label` or `aria-describedby` for tabs without
descriptive text content.

When using `SbbTabNavGroup`, always specify a label for the `<nav>` element.

#### Keyboard interaction

`SbbTabGroup` implements the following keyboard interactions.

| Shortcut           | Action                     |
| ------------------ | -------------------------- |
| `LEFT_ARROW`       | Move focus to previous tab |
| `RIGHT_ARROW`      | Move focus to next tab     |
| `HOME`             | Move focus to first tab    |
| `END`              | Move focus to last tab     |
| `SPACE` or `ENTER` | Switch to focused tab      |

`SbbTabNavBar` does not add additional keyboard handling, deferring to the native behavior of
anchor elements.
