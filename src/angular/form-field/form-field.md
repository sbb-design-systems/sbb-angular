`<sbb-form-field>` is intended to be used as a form input wrapper with label and errors.

In this document, "form field" refers to the wrapper component `<sbb-form-field>` and
"form field control" refers to the component that the `<sbb-form-field>` is wrapping
(e.g. the input, textarea, select, etc.)

On native form elements you have to apply the `sbbInput`-directive.

`<sbb-form-field>` works with `<input sbbInput>`, `<textarea sbbInput>`, `<sbb-textarea>`, `<select sbbInput>`, `<sbb-select>`, `<input sbbInput sbbDateInput>` and `<input sbbInput sbbTimeInput>`.

#### Basic examples

With sbb-label:

```html
<sbb-form-field>
  <sbb-label>Name</sbb-label>
  <input type="text" sbbInput formControlName="name" placeholder="Name" />
  <sbb-error *ngIf="form.get('name').errors?.required">This field is required.</sbb-error>
</sbb-form-field>
```

With label attribute:

```html
<sbb-form-field label="Name">
  <input type="text" sbbInput formControlName="name" placeholder="Name" />
  <sbb-error *ngIf="form.get('name').errors?.required">This field is required.</sbb-error>
</sbb-form-field>
```

### Error messages

Error messages can be shown under the form field by adding `sbb-error` elements inside the
form field. Errors are hidden initially and will be displayed on invalid form fields after the user
has interacted with the element or the parent form has been submitted.

If a form field can have more than one error state, it is up to the consumer to toggle which
messages should be displayed. This can be done with CSS, `ngIf` or `ngSwitch`. Multiple error
messages can be shown at the same time if desired, but the `<sbb-form-field>` only reserves enough
space to display one error message at a time. Ensuring that enough space is available to display
multiple errors is up to the user.

#### Display error messages outside sbb-form-field

`<sbb-form-field>` reserves space below the input field for a potential error message.
To remove this reserved space, apply the css class `sbb-form-field-errorless` to the `<sbb-form-field>` tag.
Place the `<sbb-error>` below the `<sbb-form-field>` and conditionally add the aria-describedby attribute.
Please note that this will lead to the content below the `<sbb-error>` to be pushed downward when
the error is being displayed and upward when it is being hidden.

```html
<sbb-form-field label="Name" class="sbb-form-field-errorless">
  <input
    type="text"
    sbbInput
    formControlName="name"
    placeholder="Name"
    [aria-describedby]="form.get('name').touched && form.get('name').errors?.required ? 'name-required-error' : null"
  />
</sbb-form-field>
<sbb-error
  id="name-required-error"
  *ngIf="form.get('name').touched && form.get('name').errors?.required"
  >This field is required.</sbb-error
>
```

#### Multiple error messages

Ideally you should only show one error message at a time.
If you need to display multiple error messages at the same time, it is better for accessibility
if the messages are contained in one sbb-error element.

```html
<sbb-form-field>
  <sbb-label>Name</sbb-label>
  <input type="text" formControlName="name" [placeholder]="placeholder" />
  <sbb-error>
    <ng-container *ngIf="form.get('name').errors.required">
      This field is required!<br />
    </ng-container>
    <ng-container *ngIf="form.get('name').errors.minlength">
      This field needs more chars!<br />
    </ng-container>
  </sbb-error>
</sbb-form-field>
```

### Accessibility

Any errors added to the form field are automatically added to the form field control's
`aria-describedby` set.

### Custom SbbFormFieldControl

To implement your own form field controls, please see our guide [creating a custom form field control](/angular/guides/creating-a-custom-form-field-control).

### Troubleshooting

#### Error: sbb-form-field must contain a SbbFormFieldControl

This error occurs when you have not added a form field control to your form field. If your form
field contains a native `<input>` or `<textarea>` element, make sure you've added the `sbbInput`
directive to it. See above for supported form components that can act as a form field
control.
