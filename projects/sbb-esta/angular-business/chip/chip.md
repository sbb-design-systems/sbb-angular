The chip-input component can be used to show values and categories as compact elements inside an input field.
If a chip is too long for the viewport because of the text, the text is shortened with “…”.
The input-chip textfield can also be multi-line depending on the number of chips.

```html
<sbb-chip-input formControlName="chip" [options]="options"></sbb-chip-input>
```

### Autocomplete

The chip-input implements an autocomplete feature. Upon starting to type, the user will be prompted with possible option choices.

### Usage with Reactive Forms

```ts
options = ['option1', 'option2'];

ngOnInit(): void {
  this.formGroup = this._formBuilder.group({
    chip: [{ value: [], disabled: false }, Validators.required]
  });
}
```

```html
<sbb-field label="Label" class="sbb-field-100">
  <sbb-chip-input formControlName="chip" [options]="options"></sbb-chip-input>
  <sbb-form-error *ngIf="formGroup.get('chip').errors?.required">
    This field is required.
  </sbb-form-error>
</sbb-field>
```

#### Preselection

It is also possible to provide a preselection in the form of a string value array.
If the array contains string values which are not provided in the options array, they will be ignored.

```ts
options = ['option1', 'option2'];

ngOnInit(): void {
  this.formGroup = this._formBuilder.group({
    chip: [{ value: ['option1'], disabled: false }, Validators.required]
  });
}
```
