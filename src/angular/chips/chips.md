`<sbb-chip-list>` displays a list of values as individual, keyboard accessible, chips and can control user inputs.

## Unstyled chips

By default, `<sbb-chip>` has SBB Design styles applied. For a chip with no styles applied,
use `<sbb-basic-chip>`. You can then customize the chip appearance by adding your own CSS.

_Hint: `<sbb-basic-chip>` receives the `sbb-basic-chip` CSS class in addition to the `sbb-chip` class._

## Disabled chips

Individual chips may be disabled by applying the `disabled` attribute to the chip. When disabled,
chips are not focusable.

## Chip input

The `SbbChipInput` directive can be used together with a chip-list to streamline the interaction
between the two components. This directive adds chip-specific behaviors to the input element
within `<sbb-form-field>` for adding and removing chips.

### Simple case

If you provide a FormControl (Reactive or Template) to the `sbb-chip-list`, and if you don't specify
a custom listener to `(sbbChipInputTokenEnd)` of the chip input or to `(removed)` of a `sbb-chip`, every
input will automatically be added, respectively removed, from the FormControl. The FormControl has
to be a Set or an Array to let this work properly. To let automatic removal work, it's important
to define `[value]` property on `sbb-chip`.

```angular
<sbb-form-field label="Video keywords">
  <sbb-chip-list aria-label="Video keywords" [formControl]="formControl">
    @for (keyword of formControl.value; track keyword) {
      <sbb-chip [value]="keyword">{{ keyword }}</sbb-chip>
    }
    <input placeholder="New keyword..." sbbChipInput />
  </sbb-chip-list>
</sbb-form-field>
```

### Custom Input and Removed Handlers

If you need more control over adding and removing your chip input values to your FormControl,
create your own `(sbbChipInputTokenEnd)` or `(removed)` handlers:

```ts
export interface Fruit {
  name: string;
  color: string;
}

const availableFruits = [
  { name: 'Lemon', color: 'yellow' },
  { name: 'Lime', color: 'green' },
  { name: 'Apple', color: 'red' },
];

@Component({
  selector: 'sbb-chips-input-example',
  templateUrl: 'chips-input-example.html',
})
export class ChipsInputExample {
  readonly separatorKeysCodes = [ENTER, COMMA];
  fruits: Fruit[] = availableFruits.slice(0, 1);

  add(inputEvent: SbbChipInputEvent): void {
    const value = (inputEvent.value || '').trim();

    if (!value) {
      return;
    }

    const foundFruit = availableFruits.find(
      (fruit) => fruit.name.toUpperCase() === value.toUpperCase(),
    );
    if (!foundFruit) {
      alert('fruit not available');
      return;
    }
    this.fruits.push(foundFruit);
    inputEvent.chipInput!.clear();
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
}
```

```angular
<sbb-form-field class="sbb-form-field-long" label="Favorite Fruits">
  <sbb-chip-list aria-label="Fruit selection" [(ngModel)]="fruits">
    @for (fruit of fruits; track fruit) {
      <sbb-chip (removed)="remove(fruit)"> {{ fruit.name }} ({{ fruit.color }}) </sbb-chip>
    }
    <input
      placeholder="Type name of an available fruit..."
      sbbChipInput
      [sbbChipInputSeparatorKeyCodes]="separatorKeysCodes"
      (sbbChipInputTokenEnd)="add($event)"
    />
  </sbb-chip-list>
</sbb-form-field>
```

### Autocomplete

A chip input can easily be connected with an autocomplete.
As long as there is no subscriber on `<sbb-autocomplete (optionSelected)>`,
a selected autocomplete entry will automatically be added to the FormControl of `<sbb-chip-list>`.

```angular
<sbb-form-field label="Favorite Fruits">
  <sbb-chip-list aria-label="Fruit selection" [formControl]="selectedFruits">
    @for (fruit of selectedFruits.value; track fruit) {
      <sbb-chip [value]="fruit">{{ fruit }}</sbb-chip>
    }
    <input
      placeholder="New fruit..."
      sbbChipInput
      [formControl]="fruitInputCtrl"
      [sbbAutocomplete]="auto"
    />
  </sbb-chip-list>
  <sbb-autocomplete #auto="sbbAutocomplete">
    @for (fruit of filteredFruits | async; track fruit) {
      <sbb-option [value]="fruit">{{ fruit }}</sbb-option>
    }
  </sbb-autocomplete>
</sbb-form-field>
```

## Keyboard interaction

Users can move through the chips using the arrow keys and select/deselect them with the space. Chips
also gain focus when clicked, ensuring keyboard navigation starts at the appropriate chip.

## Specifying global configuration defaults

Default options for the chips module can be specified using the `SBB_CHIPS_DEFAULT_OPTIONS`
injection token.

```ts
@NgModule({
  providers: [
    {
      provide: SBB_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    }
  ]
})
```

## Accessibility

A chip-list behaves as a `role="listbox"`, with each chip being a `role="option"`. The chip input
should have a placeholder or be given a meaningful label via `aria-label` or `aria-labelledby`.
