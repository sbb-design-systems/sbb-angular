The chip-input component can be used to show values and categories as compact elements inside an input field.
If a chip is too long for the viewport because of the text, the text is shortened with “…”.
The input-chip textfield can also be multi-line depending on the number of chips.

```html
<sbb-chip-input formControlName="chip"></sbb-chip-input>
```

### Autocomplete

The chip input can be used together with the autocomplete. Upon starting to type, the user will be prompted with possible option choices.

```ts
options = ['option1', 'option2'];
```

```html
<sbb-chip-input [sbbAutocomplete]="auto"></sbb-chip-input>
<sbb-autocomplete #auto="sbbAutocomplete">
  <sbb-option *ngFor="let option of options" [value]="option">{{ option }}</sbb-option>
</sbb-autocomplete>
```

### Usage with Reactive Forms

```ts
ngOnInit(): void {
  this.formGroup = this._formBuilder.group({
    chip: [[], Validators.required]
  });
}
```

```html
<sbb-field label="Label" mode="long">
  <sbb-chip-input formControlName="chip"></sbb-chip-input>
  <sbb-form-error *ngIf="formGroup.get('chip').errors?.required">
    This field is required.
  </sbb-form-error>
</sbb-field>
```

### Usage with Template-driven Forms

```ts
value: string[] = [];
```

```html
<form>
  <sbb-chip-input [(ngModel)]="value" name="name"></sbb-chip-input>
</form>
```
