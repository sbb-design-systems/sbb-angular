# Breadcrumb Overview

Import breadcrumb module into your application

```ts
import { BreadcrumbModule } from 'sbb-angular';
```

### What does the breadcrumb module do?

It is used to display the navigation hierarchy of the current page.
<br>
<br>

### When should the module be used?

On any page where the user should be able to quickly navigate to a sister or parent page.
<br>
<br>

### Examples

* Basic breadcrumb without sister pages

```html
<sbb-breadcrumbs>
  <sbb-breadcrumb>
    <a routerLink="/" routerLinkActive="sbb-selected">
      <sbb-icon-house></sbb-icon-house>
    </a>
  </sbb-breadcrumb>
  <sbb-breadcrumb>
    <a routerLink="/level1" routerLinkActive="sbb-selected">Level 1</a>
  </sbb-breadcrumb>
  <sbb-breadcrumb>
    <a routerLink="/level1/level2" routerLinkActive="sbb-selected">Level 2</a>
  </sbb-breadcrumb>
</sbb-breadcrumbs>
```
* Advanced breadcrumb with sister pages

```html
<sbb-breadcrumbs>
  <sbb-breadcrumb>
    <a routerLink="/" routerLinkActive="sbb-selected">
      <sbb-icon-house></sbb-icon-house>
    </a>
  </sbb-breadcrumb>

  <sbb-breadcrumb>
    Level 1 with detail pages
    <sbb-dropdown>
      <a sbbDropdownItem routerLink="/level1" routerLinkActive="sbb-selected">Level 1</a>
      <a sbbDropdownItem routerLink="/level1b" routerLinkActive="sbb-selected">Level 1b</a>
    </sbb-dropdown>
  </sbb-breadcrumb>

  <sbb-breadcrumb>
    Level 2
    <sbb-dropdown>
      <a sbbDropdownItem routerLink="/level1/level2" routerLinkActive="sbb-selected">Level 2</a>
      <a sbbDropdownItem routerLink="/level1/level2b" routerLinkActive="sbb-selected">Level 2 with detail pages</a>
    </sbb-dropdown>
  </sbb-breadcrumb>
</sbb-breadcrumbs>
```
