`<sbb-radio-button-panel>` provides the same functionality as a native `<input type="radio">` enhanced with
the SBB Design in the form of a panel.

```html
<sbb-radio-button-panel name="model-option-selection" [disabled]="disabled" [value]="option.value"
  >Example</sbb-radio-button-panel
>
```

All radio-button-panels with the same `name` comprise a set from which only one may be selected at a time.

### Radio-button label

The radio-button-panel label is provided as the content to the `<sbb-radio-button-panel>` element.

### Radio button panel subtitle

The radio-button-panel supports a subtitle, which is shown below the label in a smaller font size.

```html
<sbb-radio-button-panel
  name="single-option"
  value="single-option"
  [disabled]="disabled"
  [checked]="checked"
>
  Example
  <sbb-radio-button-panel-subtitle>Subtitle details</sbb-radio-button-panel-subtitle>
</sbb-radio-button-panel>
```

### Radio button panel warning and note

The radio button panel supports an optional warning and an optional note.

```html
<sbb-radio-button-panel
  name="single-option"
  value="single-option"
  [disabled]="disabled"
  [checked]="checked"
>
  Zürich HB - Basel SBB
  <sbb-radio-button-panel-warning>Reservation not possible</sbb-radio-button-panel-warning>
  <sbb-radio-button-panel-note>CHF 250.00</sbb-radio-button-panel-note>
</sbb-radio-button-panel>
```

### Radio groups

Radio-button-panels should typically be placed inside of an `<sbb-radio-group>` unless the DOM structure
would make that impossible (e.g., radio-button-panels inside of table cells). The radio-group has a
`value` property that reflects the currently selected radio-button-panel inside of the group.

Individual radio-button-panels inside of a radio-group will inherit the `name` of the group.

### Use with `@angular/forms`

`<sbb-radio-group>` is compatible with `@angular/forms` and supports both `FormsModule`
and `ReactiveFormsModule`.

#### Template-driven forms

```html
<sbb-radio-group [(ngModel)]="radioValue">
  <sbb-radio-button-panel value="bananas">Bananas</sbb-radio-button-panel>
  <sbb-radio-button-panel value="apple">Apple</sbb-radio-button-panel>
  <sbb-radio-button-panel value="orange">Orange</sbb-radio-button-panel>
</sbb-radio-group>
```

#### Reactive Forms

```html
<sbb-radio-group formControlName="radioValue">
  <sbb-radio-button-panel value="bananas">Bananas</sbb-radio-button-panel>
  <sbb-radio-button-panel value="apple">Apple</sbb-radio-button-panel>
  <sbb-radio-button-panel value="orange">Orange</sbb-radio-button-panel>
</sbb-radio-group>
```

### Radio button panel grouping

We provide CSS classes to group radio-button-panels and configure different column amounts per screen
resolution. Use the class `sbb-radio-panel-group` together with the classes
`sbb-col-{resolution}-{amount}`. We provide classes for the resolutions `tablet` (max 4 columns),
`desktop` (max 8 col.), `desktopLarge` (max 8 col.), `desktop2k` (max 8 col.),
`desktop4k` (max 8 col.) and `desktop5k` (max 8 col.). For `mobile` resolution it is always
limited to one column.

The below example will show one column on `mobile`, two on `tablet` and `desktop`, four on
`desktop2k` and `desktop4k` and six columns on `desktop5k`.

```html
<sbb-radio-group
  formControlName="option"
  class="sbb-radio-panel-group sbb-col-tablet-2 sbb-col-desktop2k-4 sbb-col-desktop5k-6"
>
  <sbb-radio-panel-panel>Option 1</sbb-radio-panel-panel>
  <sbb-radio-panel-panel>Option 2</sbb-radio-panel-panel>
  <sbb-radio-panel-panel>Option 3</sbb-radio-panel-panel>
  <sbb-radio-panel-panel>Option 4</sbb-radio-panel-panel>
  <sbb-radio-panel-panel>Option 5</sbb-radio-panel-panel>
  <sbb-radio-panel-panel>Option 6</sbb-radio-panel-panel>
  <sbb-radio-panel-panel>Option 7</sbb-radio-panel-panel>
  <sbb-radio-panel-panel>Option 8</sbb-radio-panel-panel>
  <sbb-radio-panel-panel>Option 9</sbb-radio-panel-panel>
</sbb-radio-group>
```

### Accessibility

The `<sbb-radio-button-panel>` uses an internal `<input type="radio">` to provide an accessible experience.
This internal radio button receives focus and is automatically labelled by the text content of the
`<sbb-radio-button-panel>` element.
