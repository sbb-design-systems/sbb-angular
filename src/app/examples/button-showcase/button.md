# Button Overview

Import button module into your application

```ts
import {
  IconArrowDownModule,
  ButtonModule
} from 'sbb-angular';
```
and then you can use the button component as seen below

```html
  <button sbbButton>
      <sbb-icon-arrow-down *sbbButtonIcon></sbb-icon-arrow-down>
      Bezeichnung
  </button>
```

The button supports four modes: primary (default), secondary, ghost and frameless as shown in the example

```html
  <button sbbButton mode="secondary">
      <sbb-icon-arrow-down *sbbButtonIcon></sbb-icon-arrow-down>
      Bezeichnung
  </button>
```