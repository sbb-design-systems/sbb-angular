`<sbb-checkbox-panel>` provides the same functionality as a native `<input type="checkbox">`
enhanced with the SBB Design in the form of a panel.

```html
<sbb-checkbox-panel
  value="single-checkbox"
  [disabled]="disabled"
  [required]="required"
  [checked]="checked"
  >Example</sbb-checkbox-panel
>
```

### Checkbox panel label

The checkbox panel label is provided as the content to the `<sbb-checkbox-panel>` element.

### Checkbox panel subtitle

The checkbox panel supports a subtitle, which is shown below the label in a smaller font size.

```html
<sbb-checkbox-panel
  value="single-checkbox"
  [disabled]="disabled"
  [required]="required"
  [checked]="checked"
>
  Example
  <sbb-checkbox-panel-subtitle>Subtitle details</sbb-checkbox-panel-subtitle>
</sbb-checkbox-panel>
```

### Checkbox panel warning and note

The checkbox panel supports an optional warning and an optional note.

```html
<sbb-checkbox-panel
  value="single-checkbox"
  [disabled]="disabled"
  [required]="required"
  [checked]="checked"
>
  Zürich HB - Basel SBB
  <sbb-checkbox-panel-warning>Reservation not possible</sbb-checkbox-panel-warning>
  <sbb-checkbox-panel-note>CHF 250.00</sbb-checkbox-panel-note>
</sbb-checkbox-panel>
```

### Use with `@angular/forms`

`<sbb-checkbox-panel>` is compatible with `@angular/forms` and supports both `FormsModule`
and `ReactiveFormsModule`.

### Indeterminate state

`<sbb-checkbox-panel>` supports an `indeterminate` state, similar to the native `<input type="checkbox">`.
While the `indeterminate` property of the checkbox panel is true, it will render as indeterminate
regardless of the `checked` value. Any interaction with the checkbox panel by a user (i.e., clicking) will
remove the indeterminate state.

### Checkbox panel grouping

We provide CSS classes to group checkbox panels and configure different column amounts per screen
resolution. Use the class `sbb-checkbox-panel-group` together with the classes
`sbb-col-{resolution}-{amount}`. We provide classes for the resolutions `tablet` (max 4 columns),
`desktop` (max 8 col.), `desktopLarge` (max 8 col.), `desktop2k` (max 8 col.),
`desktop4k` (max 8 col.) and `desktop5k` (max 8 col.). For `mobile` resolution it is always
limited to one column.

The below example will show one column on `mobile`, two on `tablet` and `desktop`, four on
`desktop2k` and `desktop4k` and six columns on `desktop5k`.

```html
<div class="sbb-checkbox-panel-group sbb-col-tablet-2 sbb-col-desktop2k-4 sbb-col-desktop5k-6">
  <sbb-checkbox-panel formControlName="control1">Option 1</sbb-checkbox-panel>
  <sbb-checkbox-panel formControlName="control2">Option 2</sbb-checkbox-panel>
  <sbb-checkbox-panel formControlName="control3">Option 3</sbb-checkbox-panel>
  <sbb-checkbox-panel formControlName="control4">Option 4</sbb-checkbox-panel>
  <sbb-checkbox-panel formControlName="control5">Option 5</sbb-checkbox-panel>
  <sbb-checkbox-panel formControlName="control6">Option 6</sbb-checkbox-panel>
  <sbb-checkbox-panel formControlName="control7">Option 7</sbb-checkbox-panel>
  <sbb-checkbox-panel formControlName="control8">Option 8</sbb-checkbox-panel>
  <sbb-checkbox-panel formControlName="control9">Option 9</sbb-checkbox-panel>
</div>
```

### Accessibility

The `<sbb-checkbox-panel>` uses an internal `<input type="checkbox">` to provide an accessible experience.
This internal checkbox receives focus and is automatically labelled by the text content of the
`<sbb-checkbox-panel>` element.

Checkboxes without text or labels should be given a meaningful label via `aria-label` or
`aria-labelledby`.

The checkbox panels are essentially large checkboxes, with more content options.
