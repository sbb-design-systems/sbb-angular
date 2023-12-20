`<sbb-search>` is a wrapper element used to display a search box, which includes a text input
field with a button attached. The input element must use the `sbbInput` directive.
An autocomplete can be used with the input element.

A `search` event is triggered, whenever either `Enter` is pressed, the button is clicked or an element
in the autocomplete is selected. The `search` event is a simple string.

```html
<sbb-search (search)="handleSearch($event)">
  <input sbbInput placeholder="Search" />
</sbb-search>
```

### Autocomplete

You can use `<sbb-search>` along with `<sbb-autocomplete>` as below:

```html
<sbb-search (search)="handleSearch($event)">
  <input sbbInput placeholder="Search" [sbbAutocomplete]="auto" />
</sbb-search>
<sbb-autocomplete #auto="sbbAutocomplete">
  @for (option of filteredOptions; track option) {
  <sbb-option [value]="option">{{ option }}</sbb-option>
  }
</sbb-autocomplete>
```

### Custom icon

The `<sbb-search>` component supports a `svgIcon` input, which can be used with any
registered icon.

See [here](/angular/icon-overview) for our available icons.

### Header variant

To use the `<sbb-search>` in a header area, we provide a separate wrapper component.
This will display a trigger consisting of an icon and text (defaults to `Search`,
visually hidden on mobile resolution), which opens `<sbb-search>` as an overlay.

```html
<button type="button" sbbHeaderSearch>
  <sbb-search (search)="handleSearch($event)">
    <input sbbInput placeholder="Search" />
  </sbb-search>
</button>
```

### Accessibility

We recommend to configure `aria-label`, `aria-labelledby` or `aria-describedby` on
`<sbb-search>`, which will be applied to the inner button element.
