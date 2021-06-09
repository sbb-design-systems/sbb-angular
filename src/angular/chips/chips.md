`<sbb-chip-list>` displays a list of values as individual, keyboard accessible, chips.

<!-- example({"example": "chips-overview",
              "file": "chips-overview-example.html"}) -->

### Unstyled chips

By default, `<sbb-chip>` has Sbberial Design styles applied. For a chip with no styles applied,
use `<sbb-basic-chip>`. You can then customize the chip appearance by adding your own CSS.

_Hint: `<sbb-basic-chip>` receives the `sbb-basic-chip` CSS class in addition to the `sbb-chip` class._

### Selection

Chips can be selected via the `selected` property. Selection can be disabled by setting
`selectable` to `false` on the `<sbb-chip-list>`.

Whenever the selection state changes, a `ChipSelectionChange` event will be emitted via
`(selectionChange)`.

### Disabled chips

Individual chips may be disabled by applying the `disabled` attribute to the chip. When disabled,
chips are neither selectable nor focusable.

### Chip input

The `SbbChipInput` directive can be used together with a chip-list to streamline the interaction
between the two components. This directive adds chip-specific behaviors to the input element
within `<sbb-form-field>` for adding and removing chips. The `<input>` with `SbbChipInput` can
be placed inside or outside the chip-list element.

An example of chip input placed inside the chip-list element.

<!-- example(chips-input) -->

An example of chip input placed outside the chip-list element.

```html
<sbb-form-field>
  <sbb-chip-list #chipList>
    <sbb-chip>Chip 1</sbb-chip>
    <sbb-chip>Chip 2</sbb-chip>
  </sbb-chip-list>
  <input [sbbChipInputFor]="chipList" />
</sbb-form-field>
```

An example of chip input with an autocomplete placed inside the chip-list element.

<!-- example(chips-autocomplete) -->

### Keyboard interaction

Users can move through the chips using the arrow keys and select/deselect them with the space. Chips
also gain focus when clicked, ensuring keyboard navigation starts at the appropriate chip.

### Orientation

If you want the chips in the list to be stacked vertically, instead of horizontally, you can apply
the `sbb-chip-list-stacked` class, as well as the `aria-orientation="vertical"` attribute:

<!-- example({"example": "chips-stacked",
              "file": "chips-stacked-example.html"}) -->

### Specifying global configuration defaults

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

### Accessibility

A chip-list behaves as a `role="listbox"`, with each chip being a `role="option"`. The chip input
should have a placeholder or be given a meaningful label via `aria-label` or `aria-labelledby`.
