`sbbInput` is a directive that allows native `<input>` and `<textarea>` elements to work with
[`<sbb-form-field>`](/angular/components/form-field/overview).

```html
<form>
  <sbb-form-field>
    <sbb-label>Name</sbb-label>
    <input type="text" sbbInput placeholder="Name" />
  </sbb-form-field>

  <sbb-form-field>
    <sbb-label>Description</sbb-label>
    <input type="text" sbbInput placeholder="Description" />
  </sbb-form-field>
</form>
```

### `<input>` and `<textarea>` attributes

All of the attributes that can be used with normal `<input>` and `<textarea>` elements can be used
on elements inside `<sbb-form-field>` as well. This includes Angular directives such as `ngModel`
and `formControl`.

The only limitation is that the `type` attribute can only be one of the values supported by
`sbbInput`.

### Supported `<input>` types

The following [input types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) can
be used with `sbbInput`:

- color
- date
- datetime-local
- email
- month
- number
- password
- search
- tel
- text
- time
- url
- week

### Form field features

There are a number of `<sbb-form-field>` features that can be used with any `<input sbbInput>` or
`<textarea sbbInput>`. These include error messages, labels, etc. For
additional information about these features, see the
[form field documentation](/angular/components/form-field/overview).

### Changing when error messages are shown

The `<sbb-form-field>` allows you to
[associate error messages](/angular/components/form-field/overview#error-messages)
with your `sbbInput`. By default, these error messages are shown when the control is invalid and
either the user has interacted with (touched) the element or the parent form has been submitted. If
you wish to override this behavior (e.g. to show the error as soon as the invalid control is dirty
or when a parent form group is invalid), you can use the `errorStateMatcher` property of the
`sbbInput`. The property takes an instance of an `SbbErrorStateMatcher` object. An `SbbErrorStateMatcher`
must implement a single method `isErrorState` which takes the `FormControl` for this `sbbInput` as
well as the parent form and returns a boolean indicating whether errors should be shown. (`true`
indicating that they should be shown, and `false` indicating that they should not.)

A global error state matcher can be specified by setting the `SbbErrorStateMatcher` provider. This
applies to all inputs. For convenience, `SbbShowOnDirtyErrorStateMatcher` is available in order to
globally cause input errors to show when the input is dirty and invalid.

```ts
@NgModule({
  providers: [
    {provide: SbbErrorStateMatcher, useClass: SbbShowOnDirtyErrorStateMatcher}
  ]
})
```

### Auto-resizing `<textarea>` elements

`<textarea>` elements can be made to automatically resize by using the
[`cdkTextareaAutosize` directive](https://material.angular.io/components/input/overview#auto-resizing-textarea-elements)
available in the CDK.

### Responding to changes in the autofill state of an `<input>`

The CDK provides
[utilities](https://material.angular.io/cdk/text-field/overview#monitoring-the-autofill-state-of-an-input)
for detecting when an input becomes autofilled and changing the appearance of the autofilled state.

### Accessibility

The `sbbInput` directive works with native `<input>` to provide an accessible experience.

#### Aria attributes

If the containing `<sbb-form-field>` has a label it will automatically be used as the `aria-label`
for the `<input>`. However, if there's no label specified in the form field, `aria-label`,
`aria-labelledby` or `<label for=...>` should be added.

#### Errors and hints

Any `sbb-error` are automatically added to the input's `aria-describedby` list, and
`aria-invalid` is automatically updated based on the input's validity state.

### Troubleshooting

#### Error: Input type "..." isn't supported by sbbInput

This error is thrown when you attempt to set an input's `type` property to a value that isn't
supported by the `sbbInput` directive. If you need to use an unsupported input type with
`<sbb-form-field>` consider writing a
[custom form field control](/angular/guides/creating-a-custom-form-field-control)
for it.
