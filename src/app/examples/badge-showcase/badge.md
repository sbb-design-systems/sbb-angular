# Badge Overview

Import button module into your application

```ts
import {
  BadgeModule
} from 'sbb-angular';
```

and then you can use the badge component as seen below

```html
<div class="badge-example">
  Hi, I'm a badge
  <sbb-badge>123</sbb-badge>
</div>
```

Tha badge supports two properties: ```position``` and ```active```.
```position``` can have two values (default | top), while ```active``` is a boolean (true is default).

When ```position``` is set as "top", the badge will be show at the top right edge of the container.

When ```active``` is set to "false", the badge will be grey colored.

## Accessibility

In order to make this component accessible, you must use the ```aria-label``` attribute on the ```<sbb-badge>``` itself:

```html
<div class="badge-example">
  Billion people in the world
  <sbb-badge aria-label="Billion people">7</sbb-badge>
</div>
```