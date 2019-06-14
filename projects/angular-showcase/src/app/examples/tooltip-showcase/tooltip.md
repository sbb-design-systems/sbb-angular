# Tooltip Overview

Import tooltip module into your application

```ts
import { TooltipModule } from '@sbb-esta/angular-public';
```

### What does tooltip do?

Tooltip allows the user to display explanations as needed.
<br/>
<br/>

### When can you use it?

You can use tooltip for context specific explanations of interaction elements or text.
<br/>
<br/>

### Characteristics and states

The tooltip consists of a question icon and the overlay. <br/>
The overlay has got the following characteristics:

- It will open when the user click on the question icon. <br/>
- It also includes a close.
- it has got two states: visible or hidden.

An example of tooltip component is shown below:

```html
<h4>Single Tooltip</h4>
<sbb-tooltip (opened)="onOpen($event)" (closed)="onClose($event)">
  {{ tooltipContent }}
</sbb-tooltip>
```

You can close the overlay in four modes:

1. Clicking (a second time) on question icon.
2. Clicking somewhere next to the overlay.
3. Clicking on another question icon.
4. Clicking on close icon included in overlay.
   <br/>

### Overlay position

The overlay is displayed:

- on top the icon question.
- on bottom the icon question.
