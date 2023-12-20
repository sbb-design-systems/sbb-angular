`<sbb-form-field>` is intended to be used as a form input wrapper with label and errors.

In this document, "form field" refers to the wrapper component `<sbb-form-field>` and
"form field control" refers to the component that the `<sbb-form-field>` is wrapping
(e.g. the input, textarea, select, etc.)

The following components are designed to work inside a `<sbb-form-field>`:

- [`<input sbbInput>` &amp; `<textarea sbbInput>`](/angular/components/input/overview)
- [`<select sbbInput>`](/angular/components/select/overview)
- [`<sbb-select>`](/angular/components/select/overview)
- [`<sbb-chip-list>`](/angular/components/chips/overview)
- [`<sbb-textarea>`](/angular/components/chips/textarea)

#### Basic examples

With sbb-label:

```angular
<sbb-form-field>
  <sbb-label>Name</sbb-label>
  <input type="text" sbbInput formControlName="name" placeholder="Name" />
  @if (form.get('name').errors?.required) {
    <sbb-error>This field is required.</sbb-error>
  }
</sbb-form-field>
```

With label attribute:

```angular
<sbb-form-field label="Name">
  <input type="text" sbbInput formControlName="name" placeholder="Name" />
  @if (form.get('name').errors?.required) {
    <sbb-error>This field is required.</sbb-error>
  }
</sbb-form-field>
```

### Form field groups

We provide utility CSS classes to group from fields together (optionally with a submit button).

| Class                      | Description                                                                                                          |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `.sbb-form-group`          | Groups `sbb-form-group` elements and buttons (optionally) horizontally.                                              |
| `.sbb-form-group-center`   | Same as `.sbb-form-group`; additionally centers the elements.                                                        |
| `.sbb-form-group-wrap`     | Same as `.sbb-form-group`; additionally wraps elements when they exceed the parent width.                            |
| `.sbb-form-group-vertical` | Groups `sbb-form-group` elements and buttons (optionally) vertically. Can be combined with `.sbb-form-group-center`. |

It is possible to combine these classes as required.

### Error messages

Error messages can be shown under the form field by adding `sbb-error` elements inside the
form field. Errors are hidden initially and will be displayed on invalid form fields after the user
has interacted with the element or the parent form has been submitted.

If a form field can have more than one error state, it is up to the consumer to toggle which
messages should be displayed. This can be done with CSS, `ngIf` or `ngSwitch`. Multiple error
messages can be shown at the same time if desired, but the `<sbb-form-field>` only reserves enough
space to display one error message at a time. Ensuring that enough space is available to display
multiple errors is up to the user.

#### Remove reserved space for error messages

`<sbb-form-field>` reserves space below the input field for a potential error message.
To remove this reserved space, apply the css class `sbb-form-field-flexible-errors` to the
`<sbb-form-field>` tag or any ancestor (e.g. `<body class="sbb-form-field-flexible-errors">`).
Place the `<sbb-error>` below the `<sbb-form-field>` and conditionally add the aria-describedby attribute.
Please note that this will lead to the content below the `<sbb-error>` to be pushed downward when
the error is being displayed and upward when it is being hidden.

#### Display error messages outside sbb-form-field

`<sbb-form-field>` constrains error messages to its width. In order to display errors with a wider width
the `<sbb-error>` element can be placed outside the `<sbb-form-field>`. Apply the css class
`sbb-form-field-flexible-errors` to the `<sbb-form-field>` tag or any ancestor to remove the reserved
error space. You will also manually need to assign the aria-describedby, as `<sbb-form-field>` is only
able to detect and automatically assign `<sbb-error>` instances inside of itself.

```angular
<sbb-form-field label="Name" class="sbb-form-field-flexible-errors">
  <input
    type="text"
    sbbInput
    formControlName="name"
    placeholder="Name"
    [aria-describedby]="
      form.get('name').touched && form.get('name').errors?.required ? 'name-required-error' : null
    "
  />
</sbb-form-field>
@if (form.get('name').touched && form.get('name').errors?.required) {
  <sbb-error id="name-required-error">This field is required.</sbb-error>
}
```

#### Multiple error messages

Ideally you should only show one error message at a time.
If you need to display multiple error messages at the same time, it is better for accessibility
if the messages are contained in one sbb-error element.

```angular
<sbb-form-field>
  <sbb-label>Name</sbb-label>
  <input type="text" formControlName="name" [placeholder]="placeholder" />
  <sbb-error>
    @if (form.get('name').errors.required) {
      This field is required!<br />
    }
    @if (form.get('name').errors.minlength) {
      This field needs more chars!<br />
    }
  </sbb-error>
</sbb-form-field>
```

#### Touched vs dirty error state checking

The default error state matcher checks for errors and whether the form control has been touched,
which is usually triggered by leaving the form (blur event). An alternative is the
`SbbShowOnDirtyErrorStateMatcher` (which needs to be added as a global provider), which
checks for errors and whether the form control is dirty instead of touched, which is triggered as
soon as the form control value changes, either by typing in the input field or selecting a value.

You can either configure the `SbbShowOnDirtyErrorStateMatcher` globally by overriding the default
`SbbErrorStateMatcher` or locally by proving it via input.

**Global**

```ts
providers: [...{ provide: SbbErrorStateMatcher, useClass: SbbShowOnDirtyErrorStateMatcher }];
```

**Local**

```ts
providers: [...SbbShowOnDirtyErrorStateMatcher];
```

```ts
  constructor(readonly errorStateMatcher: SbbShowOnDirtyErrorStateMatcher) {}
```

```angular
<sbb-form-field>
  <sbb-label>Name</sbb-label>
  <input
    type="text"
    sbbInput
    formControlName="name"
    placeholder="Name"
    [errorStateMatcher]="errorStateMatcher"
  />
  @if (form.get('name').errors?.required) {
    <sbb-error>This field is required.</sbb-error>
  }
  @if (form.get('name').errors?.minlength) {
    <sbb-error>Min length is {{ name.errors?.minlength?.requiredLength }}!</sbb-error>
  }
</sbb-form-field>
```

### Accessibility

By itself, `SbbFormField` does not apply any additional accessibility treatment to a control.
However, several of the form field's optional features interact with the control contained within
the form field.

When you provide a label via `<sbb-label>`, `SbbFormField` automatically associates this label with
the field's control via a native `<label>` element, using the `for` attribute to reference the
control's ID.

When you provide informational text via `<sbb-error>`, `SbbFormField` automatically
adds these elements' IDs to the control's `aria-describedby` attribute. Additionally,
`SbbError` applies `aria-live="polite"` by default such that assistive technology will announce errors when
they appear.

### Custom SbbFormFieldControl

To implement your own form field controls, please see our guide [creating a custom form field control](/angular/guides/creating-a-custom-form-field-control).

### Troubleshooting

#### Error: sbb-form-field must contain a SbbFormFieldControl

This error occurs when you have not added a form field control to your form field. If your form
field contains a native `<input>` or `<textarea>` element, make sure you've added the `sbbInput`
directive to it. See above for supported form components that can act as a form field
control.
