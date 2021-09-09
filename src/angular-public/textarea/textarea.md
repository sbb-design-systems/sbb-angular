The `sbb-textarea` provides a textarea experience with an integrated counter. If the counter is
not required, using a native `textarea` is preferred.

If a `maxlength` is defined, a counter is displayed in the right bottom corner.
The counter is hidden, if the `sbb-textarea` is disabled.

### Autosize

`sbb-textarea` internally uses the [`cdkTextareaAutosize`](https://material.angular.io/cdk/text-field/overview#automatically-resizing-a-textarea)
directive to automatically resize the textarea. To disable this behavior set the `autosizeDisabled`
input to `true` (e.g. `<sbb-textarea autosizeDisabled>`).

### Use with `@angular/forms`

`<sbb-textarea>` is compatible with `@angular/forms` and supports both `FormsModule`
and `ReactiveFormsModule`.

#### Template-driven forms

```html
<sbb-textarea [(ngModel)]="textArea1" [minlength]="minlength" [maxlength]="maxlength">
</sbb-textarea>
```

#### Reactive Forms

```html
<sbb-textarea formControlName="textarea" [minlength]="minlength" [maxlength]="maxlength">
</sbb-textarea>
```

If setting a validator with maxLength (e.g. `[Validators.maxLength(200)]`) the counter is not automatically displayed. Please use maxLength property of <sbb-textarea> (e.g. `<sbb-textarea [maxLength]="200">`).

### Accessibility

The `<sbb-textarea>` uses an internal `<textarea>` to provide an accessible experience.
This internal textarea receives focus.
