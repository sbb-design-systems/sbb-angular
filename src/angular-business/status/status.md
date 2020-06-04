The status component displays the status of an object, process or job.

### Status type

You can set a predefined type by setting the `type` attribute.
At the time there are `valid`, `invalid` and `warning` predefined types.

```html
<sbb-status type="valid"></sbb-status>
<sbb-status type="invalid"></sbb-status>
<sbb-status type="warning"></sbb-status>
```

### Status type and message

You can optionally provide a text message either via attribute or property access.

```html
<sbb-status type="valid" message="Example message"></sbb-status>
<sbb-status type="invalid" [message]="invalidMessage"></sbb-status>
<sbb-status type="warning" message="Specific warning"></sbb-status>
```

### Status with custom icon

You can use a custom icon by placing the icon within the `<sbb-status>` and adding the attribute sbbIcon.

```html
<sbb-status class="question">
  <sbb-icon-circle-question-mark sbbIcon></sbb-icon-circle-question-mark>
</sbb-status>

<sbb-status class="question" [message]="'question'">
  <sbb-icon-circle-question-mark sbbIcon></sbb-icon-circle-question-mark>
</sbb-status>
```

#### Provide custom background color

You can set a custom background by targeting `background-color` rule of the `.sbb-status .sbb-status-icon` selector.
In order to target the inner class, you will either need to define this rule globally in your `styles.(s)css`,
use `encapsulation: ViewEncapsulation.None` or use `::ng-deep`.

```html
<sbb-status class="question">
  <sbb-icon-circle-question-mark sbbIcon></sbb-icon-circle-question-mark>
</sbb-status>
```

```scss
// Colors: https://digital.sbb.ch/en/brand-elements/colours
.sbb-status.question .sbb-statuc-icon {
  background-color: #2d327d;
}
```

### Accessibility

Similar to an `<img>` element, an icon alone does not convey any useful information for a screen-reader user.
The user of `<sbb-status>` must provide additional information pertaining to how the icon is used,
by providing either `aria-label`, `aria-labelledby` or `aria-describedby`.

```html
<sbb-status type="valid" aria-label="The given input is valid"></sbb-status>
```
