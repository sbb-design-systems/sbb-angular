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
    <sbb-option *ngFor="let food of foods" [value]="food.value">{{food.viewValue}}</sbb-option>
  </sbb-select>
</sbb-form-field>
```

You can also use the native `<select>` which is styled with the SBB style guide.

```html
<sbb-form-field label="Lieblingsessen">
  <select [formControl]="nativeExampleFormControl" sbbInput>
    <option *ngFor="let food of foods" [value]="food.value">{{food.viewValue}}</option>
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
    <sbb-option *ngFor="let food of foods" [value]="food.value">{{food.viewValue}}</sbb-option>
  </sbb-select>
</sbb-form-field>
```

### Creating groups of options

The `<sbb-option-group>` element can be used to group common options under a subheading.
The name of the group can be set using the label property of `<sbb-option-group>`.

```html
<h4>With option groups</h4>
<sbb-form-field>
  <sbb-label>Lebensmittel aus der ganzen Welt</sbb-label>
  <sbb-select
    placeholder="Lebensmittel aus der ganzen Welt"
    [formControl]="withOptionGroupsExampleFormControl"
  >
    <sbb-option-group *ngFor="let foodNation of foodFromTheWorld" [label]="foodNation.nation">
      <sbb-option *ngFor="let food of foodNation.food" [value]="food.value"
        >{{food.viewValue}}</sbb-option
      >
    </sbb-option-group>
  </sbb-select>
</sbb-form-field>
```

The `<sbb-option-group>` can be configured to allow multiple values in each group options to
choose multiple selection by setting the `multiple` property. This will allow the user to
select multiple values at once. The name of each group can be set using the label property
of `<sbb-option-group>`.

```html
<h4>Multiple with option groups</h4>
<sbb-form-field>
  <sbb-label>Lebensmittel aus der ganzen Welt</sbb-label>
  <sbb-select
    placeholder="Lebensmittel aus der ganzen Welt"
    multiple
    [formControl]="multipleWithOptionGroupsExampleFormControl"
  >
    <sbb-option *ngFor="let food of foods" [value]="food.value">{{food.viewValue}}</sbb-option>
    <sbb-option-group *ngFor="let foodNation of foodFromTheWorld" [label]="foodNation.nation">
      <sbb-option *ngFor="let food of foodNation.food" [value]="food.value"
        >{{food.viewValue}}</sbb-option
      >
    </sbb-option-group>
  </sbb-select>
</sbb-form-field>
```

### Disabling the select, individual options or a group of options

1. It is possible to disable the entire select using the 'toggleDisabled' method on the disabled
   checkbox passing it the form control property referred to the specific select field:

```ts
toggleDisabled($event: any, control: FormControl) {
  $event.target.checked ? control.disable() : control.enable();
}
```

```html
<sbb-form-field>
  <sbb-label>Lieblingsessen</sbb-label>
  <sbb-select placeholder="Lieblingsessen" [formControl]="basicExampleFormControl">
    <sbb-option *ngFor="let food of foods" [value]="food.value">{{food.viewValue}}</sbb-option>
  </sbb-select>
</sbb-form-field>
<sbb-checkbox (change)="toggleDisabled($event,basicExampleFormControl)">disabled</sbb-checkbox>
```

2. To disable individual options using the 'toggleDisabledOptions' method on the disabled option
   checkbox passing it as third param the value 'options':

```ts
toggleDisabledOptions($event: any, component: SelectComponent | 'select', mode: 'options' | 'optionGroups') {
  if (component === 'select') {
    this.foods[1].disabled = $event.target.checked;
  } else {
    component[mode].toArray()[1].disabled = $event.target.checked;
  }
}
```

```html
<sbb-form-field>
  <sbb-label>Viele Lieblingsgerichte</sbb-label>
  <sbb-select
    placeholder="Beliebteste Lebensmittel"
    multiple
    [formControl]="multipleExampleFormControl"
    #multiSelect
  >
    <sbb-option *ngFor="let food of foods" [value]="food.value">{{food.viewValue}}</sbb-option>
  </sbb-select>
</sbb-form-field>
<sbb-checkbox (change)="toggleDisabledOptions($event, multiSelect, 'options')"
  >disabled option</sbb-checkbox
>
```

3. To disable a specific group of options using the 'toggleDisabledOptions' method on the disabled
   option checkbox passing it, as third param , the value 'optionGroups' as see below (using the
   same 'toggleDisabledOptions' method in the second point):

```html
<sbb-form-field>
  <sbb-label>Lebensmittel aus der ganzen Welt</sbb-label>
  <sbb-select
    placeholder="Lebensmittel aus der ganzen Welt"
    multiple
    [formControl]="multipleWithOptionGroupsExampleFormControl"
    #multiWithOptionGroup
  >
    <sbb-option *ngFor="let food of foods" [value]="food.value">{{food.viewValue}}</sbb-option>
    <sbb-option-group *ngFor="let foodNation of foodFromTheWorld" [label]="foodNation.nation">
      <sbb-option *ngFor="let food of foodNation.food" [value]="food.value"
        >{{food.viewValue}}</sbb-option
      >
    </sbb-option-group>
  </sbb-select>
</sbb-form-field>
<sbb-checkbox (change)="toggleDisabledOptions($event, multiWithOptionGroup, 'optionGroups')"
  >disabled option group</sbb-checkbox
>
```
