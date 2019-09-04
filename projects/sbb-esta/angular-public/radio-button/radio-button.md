You can use the radioButton component as seen below

```html
<h4>Single Radio Button</h4>
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

### Use with `@angular/forms`

`<sbb-radio-group>` is compatible with `@angular/forms` and supports both `FormsModule`
and `ReactiveFormsModule`.

### Accessibility

The `<sbb-radio-button>` uses an internal `<input type="radio">` to provide an accessible experience.
This internal radio button receives focus and is automatically labelled by the text content of the
`<sbb-radio-button>` element.
