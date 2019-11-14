The status shows the status of an object.

You find the UX description of this component on https://digital.sbb.ch/en/webapps/components/status.

### Bubble

Set an `sbb-icon` tag as content inside the `<sbb-status>`.

```html
<sbb-status>
  <sbb-icon-circle-question-mark></sbb-icon-circle-question-mark>
</sbb-status>
<sbb-status>
  <sbb-icon-train-station></sbb-icon-train-station>
</sbb-status>
```

### Extended

It is possible to show a detailed status with a text.
You can style the icon by setting an `[svgClass]` on the `sbb-icon` as shown in the frist example.

```html
<sbb-status [message]="'valid'">
  <sbb-icon-tick [svgClass]="'sbb-status-ok'"></sbb-icon-tick>
</sbb-status>
<sbb-status [message]="'question'">
  <sbb-icon-circle-question-mark></sbb-icon-circle-question-mark>
</sbb-status>
<sbb-status [message]="'stops'">
  <sbb-icon-train-station></sbb-icon-train-station>
</sbb-status>
```

### Extended with tooltip

Use the `[tooltipText]` input to add an overlay tooltip.

```html
<sbb-status [message]="'valid'" [tooltipText]="'valid status'">
  <sbb-icon-tick [svgClass]="'sbb-status-ok'"></sbb-icon-tick>
</sbb-status>
```
