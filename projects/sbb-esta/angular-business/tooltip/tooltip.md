The tooltip module allows the user to display additional information as needed.

### When can you use it?

You can use tooltip for context specific explanations of interaction elements or text.

### Characteristics and states

The tooltip consists of a question icon and the overlay.

The overlay has got the following characteristics:

- It will open when the user click on the question icon.
- It also includes a close.
- it has got two states: visible or hidden.

An example of the tooltip component is shown below:

```html
<h4>Single Tooltip</h4>
<sbb-tooltip (opened)="onOpen($event)" (closed)="onClose($event)">
  {{ tooltipContent }}
</sbb-tooltip>
```

The tooltip will be closed due to any of the following actions:

- Clicking (a second time) on question icon.
- Clicking somewhere next to the overlay.
- Clicking on another question icon.
- Clicking on the close icon displayed in overlay.

### Overlay position

The overlay is either displayed above or below the icon, depending on space available.

### Hover

You can set the tooltip to trigger on `hover`. With hover mode it is possible to define
a delay in milliseconds for opening and closing the tooltip. The tooltip will still
open on click, as a fallback for mobile.

```html
<sbb-tooltip trigger="hover" [hoverOpenDelay]="200" [hoverCloseDelay]="200">
  {{ tooltipContent }}
</sbb-tooltip>
```
