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

### Checkbox Groups

By creating a wrapper around `<sbb-checkbox>`-elements and adding the corresponding css class, it's possible to align the checkboxes:

- vertical alignment of checkboxes:
  `<div class="sbb-checkbox-group-vertical"><sbb-checkbox></sbb-checkbox>...</div>`
- horizontal alignment of checkboxes:
  `<div class="sbb-checkbox-group-horizontal"><sbb-checkbox></sbb-checkbox>...</div>`

### Accessibility

The `<sbb-checkbox>` uses an internal `<input type="checkbox">` to provide an accessible experience.
This internal checkbox receives focus and is automatically labelled by the text content of the
`<sbb-checkbox>` element.

Checkboxes without text or labels should be given a meaningful label via `aria-label` or
`aria-labelledby`.
