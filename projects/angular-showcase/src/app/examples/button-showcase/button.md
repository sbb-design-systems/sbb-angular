# Button Overview

Import button module into your application

```ts
import { IconArrowRightModule, ButtonModule } from '@sbb-esta/angular-public';
```

and then you can use the button component as seen below

```html
<button sbbButton>
  <sbb-icon-arrow-right *sbbButtonIcon></sbb-icon-arrow-right>
  Bezeichnung
</button>
```

The button supports four modes: primary (default), secondary, ghost and frameless as shown in the example

```html
<button sbbButton mode="secondary">
  <sbb-icon-arrow-right *sbbButtonIcon></sbb-icon-arrow-right>
  Bezeichnung
</button>
```
