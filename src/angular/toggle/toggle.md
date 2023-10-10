The `<sbb-toggle>` component offers the user a choice of exactly two options
(or optionally three for lean design).

```html
<sbb-toggle>
  <sbb-toggle-option label="Option 1" value="dog"></sbb-toggle-option>
  <sbb-toggle-option value="cat">
    <sbb-toggle-label>Option 2</sbb-toggle-label>
  </sbb-toggle-option>
</sbb-toggle>
```

The specification states that if no previous selection has been defined the first option is selected automatically.
In this case a change event is fired to notify about the automatic selection.

### Subtitle

A `<sbb-toggle-option>` can have an optional subtitle, which will be shown below the label.
The subtitle will be hidden on selection.

```html
<sbb-toggle>
  <sbb-toggle-option label="Option 1" subtitle="Detail 1" value="dog"></sbb-toggle-option>
  <sbb-toggle-option label="Option 2" value="cat">
    <sbb-toggle-subtitle>Detail 2</sbb-toggle-subtitle>
  </sbb-toggle-option>
</sbb-toggle>
```

### Icon

A `<sbb-toggle-option>` can have an optional icon, which will be shown on the left side of
the label.

Either use the `svgIcon` input or the `<sbb-toggle-icon>` element.

```html
<sbb-toggle>
  <sbb-toggle-option label="Option 1" value="dog" svgIcon="arrow-right-small"> </sbb-toggle-option>
  <sbb-toggle-option value="cat">
    <sbb-toggle-icon>
      <sbb-icon svgIcon="arrows-right-left-small"></sbb-icon>
    </sbb-toggle-icon>
    <sbb-toggle-label>Option 2</sbb-toggle-label>
  </sbb-toggle-option>
</sbb-toggle>
```

### Option details

A `<sbb-toggle-option>` can have optional content with `<sbb-toggle-details>`, which will be shown
below the option if the option is currently selected. This can be any kind of content.

```html
<sbb-toggle>
  <sbb-toggle-option label="Option 1" value="dog">
    <sbb-toggle-details>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
    </sbb-toggle-details>
  </sbb-toggle-option>
  <sbb-toggle-option value="cat">
    <sbb-toggle-label>Option 2<sbb-toggle-label>
    <sbb-toggle-details>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    </sbb-toggle-details>
  </sbb-toggle-option>
</sbb-toggle>
```

### Use with `@angular/forms`

`<sbb-toggle>` is compatible with `@angular/forms` and supports both `FormsModule`
and `ReactiveFormsModule`.

#### Template-driven forms

```html
<sbb-toggle [(ngModel)]="toggleValue">
  <sbb-toggle-option label="Option 1" value="dog"></sbb-toggle-option>
  <sbb-toggle-option label="Option 2" value="cat"></sbb-toggle-option>
</sbb-toggle>
```

#### Reactive Forms

```html
<sbb-toggle formControlName="toggleValue">
  <sbb-toggle-option label="Option 1" value="dog"></sbb-toggle-option>
  <sbb-toggle-option label="Option 2" value="cat"></sbb-toggle-option>
</sbb-toggle>
```

### Accessibility

The `<sbb-toggle-option>` uses an internal `<input type="radio">` to provide an accessible experience.
This internal radio button receives focus and is automatically labelled by the panel of the
`<sbb-toggle-option>` element.
