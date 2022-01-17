`<sbb-radio-button>` provides the same functionality as a native `<input type="radio">` enhanced with
the SBB Design.

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

#### Radio button alignment inside radio group

By adding the corresponding css class, it's possible to align the radio buttons inside a radio group:

- vertical alignment of radio buttons: `<sbb-radio-group class="sbb-radio-group-vertical">`
- horizontal alignment of radio buttons: `<sbb-radio-group class="sbb-radio-group-horizontal">`

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

`SbbRadioButton` uses an internal `<input type="radio">` to provide an accessible experience.
This internal radio button receives focus and is automatically labelled by the text content of the
`<sbb-radio-button>` element. Avoid adding other interactive controls into the content of
`<sbb-radio-button>`, as this degrades the experience for users of assistive technology.

Always provide an accessible label via `aria-label` or `aria-labelledby` for radio buttons without
descriptive text content. For dynamic labels and descriptions, `SbbRadioButton` provides input
properties for binding `aria-label`, `aria-labelledby`, and `aria-describedby`. This means that you
should not use the `attr.` prefix when binding these properties, as demonstrated below.

```html
<sbb-radio-button [aria-label]="getMultipleChoiceAnswer()"> </sbb-radio-button>
```

Prefer placing all radio buttons inside of a `<sbb-radio-group>` rather than creating standalone
radio buttons because groups are easier to use exclusively with a keyboard.

You should provide an accessible label for all `<sbb-radio-group>` elements via `aria-label` or
`aria-labelledby`.
