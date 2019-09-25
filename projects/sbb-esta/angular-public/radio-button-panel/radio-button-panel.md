The radio button panels are essentially large radio buttons, with more content options.

### Simple radio button panel

```html
<sbb-radio-button-panel
  name="model-option-selection"
  [value]="option.value"
  [label]="option.name"
></sbb-radio-button-panel>
```

### Radio button panel with a subtitle

```html
<sbb-radio-button-panel
  name="single-option"
  value="single-option"
  [checked]="checked"
  label="SBB - Finanzen"
  subtitle="Armin Burgermeister"
></sbb-radio-button-panel>
```

### Radio button panel with an icon

```html
<sbb-radio-button-panel
  name="single-option"
  value="single-option"
  [checked]="checked"
  label="SBB - Finanzen"
  subtitle="Armin Burgermeister"
>
  <sbb-icon-heart sbbIcon></sbb-icon-heart>
</sbb-radio-button-panel>
```

### Radio groups

Radio-button panels should typically be placed inside of an `<sbb-radio-group>` unless the DOM structure
would make that impossible (e.g., radio-buttons inside of table cells). The radio-group has a
`value` property that reflects the currently selected radio-button panel inside of the group.

Individual radio-button panel inside of a radio-group will inherit the `name` of the group.

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

### Accessibility

The `<sbb-radio-button-panel>` uses an internal `<input type="radio">` to provide an accessible experience.
This internal radio button receives focus and is automatically labelled by the text content of the
`<sbb-radio-button-panel>` element.
