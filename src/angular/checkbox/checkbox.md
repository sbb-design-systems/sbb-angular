`<sbb-checkbox>` provides the same functionality as a native `<input type="checkbox">`
enhanced with the SBB Design.

```html
<sbb-checkbox
  value="single-checkbox"
  [disabled]="disabled"
  [required]="required"
  [checked]="checked"
  >Example</sbb-checkbox
>
```

### Checkbox label

The checkbox label is provided as the content to the `<sbb-checkbox>` element.

If you don't want the label to appear next to the checkbox, you can use
[`aria-label`](https://www.w3.org/TR/wai-aria/states_and_properties#aria-label) or
[`aria-labelledby`](https://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby) to
specify an appropriate label.

### Use with `@angular/forms`

`<sbb-checkbox>` is compatible with `@angular/forms` and supports both `FormsModule`
and `ReactiveFormsModule`.

### Indeterminate state

`<sbb-checkbox>` supports an `indeterminate` state, similar to the native `<input type="checkbox">`.
While the `indeterminate` property of the checkbox is true, it will render as indeterminate
regardless of the `checked` value. Any interaction with the checkbox by a user (i.e., clicking) will
remove the indeterminate state.

### Checkbox Groups

By creating a wrapper around `<sbb-checkbox>`-elements and adding the corresponding css class, it's possible to align the checkboxes.

#### Vertical

```html
<div class="sbb-checkbox-group-vertical">
  <sbb-checkbox *ngFor="let control of controls" [formControl]="control"></sbb-checkbox>
</div>
```

#### Horizontal

```html
<div class="sbb-checkbox-group-horizontal">
  <sbb-checkbox *ngFor="let control of controls" [formControl]="control"></sbb-checkbox>
</div>
```

### Accessibility

The `<sbb-checkbox>` uses an internal `<input type="checkbox">` to provide an accessible experience.
This internal checkbox receives focus and is automatically labelled by the text content of the
`<sbb-checkbox>` element.

Checkboxes without text or labels should be given a meaningful label via `aria-label` or
`aria-labelledby`.
