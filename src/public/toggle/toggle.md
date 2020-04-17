The `<sbb-toggle>` component offers the user a choice of exactly two options.

```html
<sbb-toggle>
  <sbb-toggle-option label="Option 1" value="dog"></sbb-toggle-option>
  <sbb-toggle-option label="Option 2" value="cat"></sbb-toggle-option>
</sbb-toggle>
```

### Info text

A `<sbb-toggle-option>` can have an optional info text, which will be shown below the label.

```html
<sbb-toggle>
  <sbb-toggle-option label="Option 1" infoText="Detail 1" value="dog"></sbb-toggle-option>
  <sbb-toggle-option label="Option 2" infoText="Detail 2" value="cat"></sbb-toggle-option>
</sbb-toggle>
```

### Icon

A `<sbb-toggle-option>` can have an optional icon, which will be shown on the left side of
the label.

```html
<sbb-toggle>
  <sbb-toggle-option label="Option 1" value="dog">
    <sbb-icon-arrow-right *sbbIcon></sbb-icon-arrow-right>
  </sbb-toggle-option>
  <sbb-toggle-option label="Option 2" value="cat">
    <sbb-icon-arrows-right-left *sbbIcon></sbb-icon-arrows-right-left>
  </sbb-toggle-option>
</sbb-toggle>
```

### Option content

A `<sbb-toggle-option>` can have optional content, which will be shown below the option
if the option is currently selected. This can be any kind of html content.

```html
<sbb-toggle>
  <sbb-toggle-option label="Option 1" value="dog">
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
  </sbb-toggle-option>
  <sbb-toggle-option label="Option 2" value="cat">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur.
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
