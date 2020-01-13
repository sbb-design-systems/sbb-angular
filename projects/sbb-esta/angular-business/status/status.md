The status shows the status of an object.

You find the UX description of this component on https://digital.sbb.ch/en/webapps/components/status.

### Status with type

You can set a predefined type by setting the `type` attribute.
At the time there are `'valid'`, `'invalid'` and `'warning'` predefined types.

```html
<sbb-status type="valid" [message]="'valid type'"></sbb-status>
<sbb-status type="invalid" [message]="'invalid type'"></sbb-status>
<sbb-status type="warning" [message]="'warning type'"></sbb-status>
```

### Status with content tag

You can set an `sbb-icon` tag as content inside the `<sbb-status>`.

```html
<sbb-status [message]="'question'">
  <sbb-icon-circle-question-mark></sbb-icon-circle-question-mark>
</sbb-status>
```

### Bubble

Status without message.

```html
<sbb-status type="warning"></sbb-status>

<sbb-status>
  <sbb-icon-train-station></sbb-icon-train-station>
</sbb-status>
```

### Extended

It is possible to show a detailed status with a text.
You can style the icon by setting an `[svgClass]` on the `sbb-icon` as shown in the frist example.

```html
<sbb-status [message]="'question'">
  <sbb-icon-circle-question-mark [svgClass]="'sbb-status-question'"></sbb-icon-circle-question-mark>
</sbb-status>
<sbb-status [message]="'train staion'">
  <sbb-icon-train-station></sbb-icon-train-station>
</sbb-status>
<sbb-status type="valid" [message]="'valid status message'"></sbb-status>
```

### Extended with tooltip

Use the `[sbbTooltip]` input to add an overlay tooltip.
The tooltip open/close delay can be set by `[tooltipOpenDelay]` and `[tooltipCloseDelay]` inputs.
By default there is no tooltip open/close delay set.

```html
<sbb-status
  [message]="'valid'"
  [sbbTooltip]="'valid status'"
  [tooltipOpenDelay]="1000"
  [tooltipCloseDelay]="1000"
>
  <sbb-icon-tick [svgClass]="'sbb-status-ok'"></sbb-icon-tick>
</sbb-status>
```
