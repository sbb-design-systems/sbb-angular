# Contextmenu Overview

Import contextmenu module in your application

```ts
import { ContextmenuModule } from '@sbb-esta/angular-public';
```

### Basic Usage

```html
<sbb-contextmenu>
  <sbb-dropdown>
    <button sbbDropdownItem type="button" (click)="action1()">Action 1</button>
    <button sbbDropdownItem type="button" (click)="action2()">Action 2</button>
    <button sbbDropdownItem type="button" (click)="action3()">Action 3</button>
  </sbb-dropdown>
</sbb-contextmenu>
```
