`<sbb-radio-button>` provides the same functionality as a native `<input type="radio">`

```html
<sbb-radio-button
  name="single-radio"
  value="single-radio"
  [disabled]="disabled"
  [required]="required"
  [checked]="checked"
  >Radio 1</sbb-radio-button
>
```

All radio-buttons with the same `name` comprise a set from which only one may be selected at a time.

### Radio-button label

The radio-button label is provided as the content to the `<sbb-radio-button>` element.

### Radio groups

Radio-buttons should typically be placed inside of an `<sbb-radio-group>` unless the DOM structure
would make that impossible (e.g., radio-buttons inside of table cells). The radio-group has a
`value` property that reflects the currently selected radio-button inside of the group.

Individual radio-buttons inside of a radio-group will inherit the `name` of the group.

### Use with `@angular/forms`

`<sbb-radio-group>` is compatible with `@angular/forms` and supports both `FormsModule`
and `ReactiveFormsModule`.

#### Template-driven forms

```html
<sbb-radio-group [(ngModel)]="radioValue">
  <sbb-radio-button value="bananas">Bananas</sbb-radio-button>
  <sbb-radio-button value="apple">Apple</sbb-radio-button>
  <sbb-radio-button value="orange">Orange</sbb-radio-button>
</sbb-radio-group>
```

#### Reactive Forms

```html
<sbb-radio-group formControlName="radioValue">
  <sbb-radio-button value="bananas">Bananas</sbb-radio-button>
  <sbb-radio-button value="apple">Apple</sbb-radio-button>
  <sbb-radio-button value="orange">Orange</sbb-radio-button>
</sbb-radio-group>
```

### Accessibility

The `<sbb-radio-button>` uses an internal `<input type="radio">` to provide an accessible experience.
This internal radio button receives focus and is automatically labelled by the text content of the
`<sbb-radio-button>` element.
