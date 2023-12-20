`<sbb-select>` is a form control for selecting a value from a set of options.
To add options to the select, add `<sbb-option>` elements to the `<sbb-select>`.
Each `<sbb-option>` has a value property that can be used to set the value that will be selected
if the user chooses this option. The content of the `<sbb-option>` is what will be shown to the
user.

You can use select component with sbb style using `<sbb-select>` and `<sbb-option>` as seen below

```html
<sbb-form-field>
  <sbb-label>Lieblingsessen</sbb-label>
  <sbb-select placeholder="Lieblingsessen" [formControl]="basicExampleFormControl">
    @for (food of foods; track food) {
    <sbb-option [value]="food.value">{{ food.viewValue }}</sbb-option>
    }
  </sbb-select>
</sbb-form-field>
```

You can also use the native `<select>` which is styled with the SBB style guide.

```html
<sbb-form-field label="Lieblingsessen">
  <select [formControl]="nativeExampleFormControl" sbbInput>
    @for (food of foods; track food) {
    <option [value]="food.value">{{ food.viewValue }}</option>
    }
  </select>
</sbb-form-field>
```

### Multiple Selection

The default `<sbb-select>` allows to single-selection mode, but can be configured to choose
multiple selection by setting the `multiple` property. This will allow the user to select
multiple values at once.

```html
<h4>Multiple Example</h4>
<sbb-form-field>
  <sbb-label>Viele Lieblingsgerichte</sbb-label>
  <sbb-select
    placeholder="Beliebteste Lebensmittel"
    multiple
    [formControl]="multipleExampleFormControl"
  >
    @for (food of foods; track food) {
    <sbb-option [value]="food.value">{{ food.viewValue }}</sbb-option>
    }
  </sbb-select>
</sbb-form-field>
```

### Creating groups of options

The `<sbb-optgroup>` element can be used to group common options under a subheading.
The name of the group can be set using the label property of `<sbb-optgroup>`.

```html
<h4>With option groups</h4>
<sbb-form-field>
  <sbb-label>Lebensmittel aus der ganzen Welt</sbb-label>
  <sbb-select
    placeholder="Lebensmittel aus der ganzen Welt"
    [formControl]="withOptionGroupsExampleFormControl"
  >
    @for (foodNation of foodFromTheWorld; track foodNation) {
    <sbb-optgroup [label]="foodNation.nation">
      @for (food of foodNation.food; track food) {
      <sbb-option [value]="food.value">{{ food.viewValue }}</sbb-option>
      }
    </sbb-optgroup>
    }
  </sbb-select>
</sbb-form-field>
```

The `<sbb-optgroup>` can be configured to allow multiple values in each group options to
choose multiple selection by setting the `multiple` property. This will allow the user to
select multiple values at once. The name of each group can be set using the label property
of `<sbb-optgroup>`.

```html
<h4>Multiple with option groups</h4>
<sbb-form-field>
  <sbb-label>Lebensmittel aus der ganzen Welt</sbb-label>
  <sbb-select
    placeholder="Lebensmittel aus der ganzen Welt"
    multiple
    [formControl]="multipleWithOptionGroupsExampleFormControl"
  >
    @for (food of foods; track food) {
    <sbb-option [value]="food.value">{{ food.viewValue }}</sbb-option>
    @for (foodNation of foodFromTheWorld; track foodNation) {
    <sbb-optgroup [label]="foodNation.nation">
      @for (food of foodNation.food; track food) {
      <sbb-option [value]="food.value">{{ food.viewValue }}</sbb-option>
      }
    </sbb-optgroup>
    } }
  </sbb-select>
</sbb-form-field>
```

### Disabling the select, individual options or a group of options

When working with Reactive Forms, the select component can be disabled/enabled via form controls.
This can be accomplished by creating a `FormControl` with the disabled property
`FormControl({ value: '', disabled: true })` or using `FormControl.enable()`,
`FormControl.disable()`.

It is possible to disable the entire select, individual options or option groups in the select by
using the disabled property on the `<select>`, `<sbb-select>`, `<option>`, `<sbb-option>`
or `<sbb-optgroup>` elements respectively.

```ts
disableSelect = new FormControl(false);
```

```html
<p>
  <sbb-checkbox [formControl]="disableSelect">Disable select</sbb-checkbox>
</p>

<sbb-form-field appearance="fill">
  <sbb-label>International food</sbb-label>
  <sbb-select [disabled]="disableSelect.value">
    <sbb-optgroup label="Switzerland">
      <sbb-option value="option1">Rösti</sbb-option>
      <sbb-option value="option2" disabled>Birchermüesli</sbb-option>
    </sbb-optgroup>
    <sbb-optgroup label="Germany" disabled>
      <sbb-option value="option3">Weisswurst</sbb-option>
    </sbb-optgroup>
    <sbb-optgroup label="Italy">
      <sbb-option value="option3">Pasta</sbb-option>
      <sbb-option value="option3">Lasagna</sbb-option>
    </sbb-optgroup>
  </sbb-select>
</sbb-form-field>
```
