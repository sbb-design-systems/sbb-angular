The breadcrumb module is used to display the navigation hierarchy of the current page.
It is intended to be used on pages where the user should be able to quickly navigate to a sister or parent page.

```html
<sbb-breadcrumbs>
  <a sbb-breadcrumb-root routerLink="/" aria-label="Back to the homepage"></a>
  <sbb-breadcrumb>
    <a routerLink="/level1">Level 1</a>
  </sbb-breadcrumb>
  <sbb-breadcrumb>
    <a routerLink="/level1/level2" aria-current="location">Level 2</a>
  </sbb-breadcrumb>
</sbb-breadcrumbs>
```

#### First entry

The first breadcrumb entry should always point to the homepage and can be defined
by applying `sbb-breadcrumb-root` directive to a link.

```html
<a sbb-breadcrumb-root routerLink="/" aria-label="Back to the homepage"></a>
```

#### Last entry

The last `<sbb-breadcrumb>` entry has always to be the currently displayed page.

### Sister pages

If using sister pages, consider that the trigger text should always be the active page name.
Inside the menu panel the current active page can be highlighted by applying `sbb-active` class
which is typically done by the `routerLinkActive` attribute.

```html
<sbb-breadcrumbs>
  <a
    sbb-breadcrumb-root
    routerLink="/"
    routerLinkActive="sbb-active"
    aria-label="Back to the homepage"
  ></a>

  <sbb-breadcrumb>
    <button [sbbMenuTriggerFor]="menu">Level 1 with sister pages</button>
    <sbb-menu #menu="sbbMenu">
      <a sbb-menu-item routerLink="/level1" routerLinkActive="sbb-active"
        >Level 1 with sister pages</a
      >
      <a sbb-menu-item routerLink="/level1b" routerLinkActive="sbb-active">Level 1b</a>
    </sbb-menu>
  </sbb-breadcrumb>

  <sbb-breadcrumb>
    <button [sbbMenuTriggerFor]="menu2">Level 2b with sister pages</button>
    <sbb-menu #menu2="sbbMenu">
      <a sbb-menu-item routerLink="/level1/level2" routerLinkActive="sbb-active">Level 2</a>
      <a
        sbb-menu-item
        routerLink="/level1/level2b"
        routerLinkActive="sbb-active"
        aria-current="location"
        >Level 2b with sister pages</a
      >
    </sbb-menu>
  </sbb-breadcrumb>
</sbb-breadcrumbs>
```

### Accessibility

- For a better accessibility add an aria-label to your `sbb-breadcrumb-root` link
  (e.g. `<a aria-label="Back to the homepage" ...>`).
- The active link (normally the last entry) should receive the `aria-current="location"`
  attribute to indicate that this site is currently being displayed.
