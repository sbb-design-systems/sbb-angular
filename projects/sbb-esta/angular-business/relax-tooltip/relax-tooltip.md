The relax tooltip can be attached to any element.

### Relax tooltip

The `sbbTooltip` directive can be used to define a relax tooltip on a component or html element.

```html
<p>
  <span class="simple" sbbTooltip="Default Tooltip">Hover me to see the default tooltip</span>
</p>
```

### Relax Tooltip with close and open delay

You can set a `[tooltipOpenDelay]` and or a `[tooltipCloseDelay]`.

```html
<p>
  <span
    class="info"
    sbbTooltip="Delay Tooltip"
    [tooltipOpenDelay]="1000"
    [tooltipCloseDelay]="1000"
  >
    tooltip with open/close delay of one second.
  </span>
</p>
```

### Relax Tooltip with custom position

Set a custom position for the relax tooltip. By Default the position is centered.

```html
<p>
  <span
    sbbTooltip="Tooltip on the left"
    [tooltipPosition]="{
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -2
  }"
    >tooltip is positioned on the left side</span
  >
</p>
```

### Relax Tooltip with custom content

It is possible to set a custom content as tooltip.
Set a templateRef as input for `[sbbTooltip]`.

```html
<p>
  <span class="custom" [sbbTooltip]="template" [tooltipPosition]="leftTooltipPosition"
    >See the custom tooltip content</span
  >
</p>

<ng-template #template>
  <div class="sbb-tooltip-template">
    Custom tooltip
  </div>
</ng-template>
```
