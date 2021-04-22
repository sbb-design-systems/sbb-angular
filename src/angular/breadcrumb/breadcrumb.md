The breadcrumb module is used to display the navigation hierarchy of the current page.

### When should the module be used?

On any page where the user should be able to quickly navigate to a sister or parent page.

### Examples

- Basic breadcrumb without sister pages

```html
<sbb-breadcrumbs>
  <a
    sbb-breadcrumb-root
    routerLink="/"
    routerLinkActive="sbb-active"
    aria-label="Back to the homepage"
  ></a>
  <sbb-breadcrumb>
    <a routerLink="/level1" routerLinkActive="sbb-active">Level 1</a>
  </sbb-breadcrumb>
  <sbb-breadcrumb>
    <a routerLink="/level1/level2" routerLinkActive="sbb-active">Level 2</a>
  </sbb-breadcrumb>
</sbb-breadcrumbs>
```

- Advanced breadcrumb with sister pages

```html
<sbb-breadcrumbs>
  <a
    sbb-breadcrumb-root
    routerLink="/"
    routerLinkActive="sbb-active"
    aria-label="Back to the homepage"
  ></a>

  <sbb-breadcrumb>
    <button [sbbMenuTriggerFor]="menu">
      <ng-template sbbMenuDynamicTrigger>Level 1 with detail pages</ng-template>
    </button>
    <sbb-menu #menu="sbbMenu">
      <a sbb-menu-item routerLink="/level1" routerLinkActive="sbb-active">Level 1</a>
      <a sbb-menu-item routerLink="/level1b" routerLinkActive="sbb-active">Level 1b</a>
    </sbb-menu>
  </sbb-breadcrumb>

  <sbb-breadcrumb>
    <button [sbbMenuTriggerFor]="menu2">
      <ng-template sbbMenuDynamicTrigger>Level 2</ng-template>
    </button>
    <sbb-menu #menu2="sbbMenu">
      <a sbb-menu-item routerLink="/level1/level2" routerLinkActive="sbb-active">Level 2</a>
      <a sbb-menu-item routerLink="/level1/level2b" routerLinkActive="sbb-active"
        >Level 2 with detail pages</a
      >
    </sbb-menu>
  </sbb-breadcrumb>
</sbb-breadcrumbs>
```
