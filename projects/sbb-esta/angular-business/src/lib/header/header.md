# Header Overview

Import header module in your application

```ts
import { HeaderModule } from '@sbb-esta/angular-business';
```

The header will appear at the top of the screen in a fixed position, and provide a container for navigation, usermenu, and eventually a logo.
It supports &lt;a&gt; and &lt;button&gt; tags for navigation. Optionally an &lt;sbb-usermenu&gt; can be provided, as well as any element with a [brand] property, or .brand class, for replacing the standard logo.

```html
<sbb-header [label]="Title" [subtitle]="Subtitle" [environment]="dev" [environmentColor]="red">
  <a routerLink="/">A tag</a>
  <button sbbNavbutton type="button" [sbbDropdown]="dropdown">Button tag</button>
  <button sbbNavbutton type="button">Button tag with dropdown</button>
  <sbb-dropdown #dropdown="sbbDropdown">
    <a sbbDropdownItem routerLink="/navigation1/section1" routerLinkActive="sbb-selected"
      >Option 1</a
    >
    <a sbbDropdownItem routerLink="/navigation1/section2" routerLinkActive="sbb-selected"
      >Option 2</a
    >
  </sbb-dropdown>
  <sbb-usermenu ...>
    <!-- A usermenu can be optionally included -->
  </sbb-usermenu>
  <svg brand>
    <!-- A logo can be optionally included -->
  </svg>
</sbb-header>
```
