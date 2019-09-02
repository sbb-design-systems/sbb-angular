You can use the checkbox component as seen below

```html
<sbb-checkbox
  value="single-checkbox"
  [disabled]="disabled"
  [required]="required"
  [checked]="checked"
  >Checkbox 1</sbb-checkbox
>
```

### Checkbox label

The checkbox label is provided as the content to the `<sbb-checkbox>` element.

### Use with `@angular/forms`

`<sbb-checkbox>` is compatible with `@angular/forms` and supports both `FormsModule`
and `ReactiveFormsModule`.

### Indeterminate state

`<sbb-checkbox>` supports an `indeterminate` state, similar to the native `<input type="checkbox">`.
While the `indeterminate` property of the checkbox is true, it will render as indeterminate
regardless of the `checked` value. Any interaction with the checkbox by a user (i.e., clicking) will
remove the indeterminate state.

### Accessibility

The `<sbb-checkbox>` uses an internal `<input type="checkbox">` to provide an accessible experience.
This internal checkbox receives focus and is automatically labelled by the text content of the
`<sbb-checkbox>` element.

Checkboxes without text or labels should be given a meaningful label via `aria-label` or
`aria-labelledby`.
