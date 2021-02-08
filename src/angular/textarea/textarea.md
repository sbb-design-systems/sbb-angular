### Counter

If a `maxlength` is defined, a counter is displayed in the right bottom corner.
The counter is hidden, if the `sbb-textarea` is disabled.

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

### Native Textarea

The Native textarea (e.g. `<textarea>`) doesn't adapt its size automatically. If you like to have an auto resize behaviour, use `<sbb-textarea>` or apply `cdkTextareaAutosize` directive to `<textarea>`.
