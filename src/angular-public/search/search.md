`<sbb-search>` is a form control used to display a search box (with a search field and relative
search button), and optionally it can be used in combination with `<sbb-autocomplete>` to show
search results suggestions.
Moreover it's possible to use it in "header" mode, where a button trigger has to be clicked before
the search field itself shows up and use a custom icon instead of the `<sbb-icon-magnifying-glass>`
provided by default.

Everytime the enter key on the input field is pressed, the search button is clicked or an option
is selected a `search` event, containing the search term, is emitted.

### Simplest use case

The simplest way you can use `<sbb-search>` is the following one:

```html
<sbb-search (search)="searchCallback(searchTerm)" placeholder="Suchen"></sbb-search>
```

##3 Autocomplete use case

You can use `<sbb-search>` along with `<sbb-autocomplete>` as below:

```html
<sbb-search
  (search)="searchCallback(searchTerm)"
  placeholder="Suchen"
  [sbbAutocomplete]="auto"
></sbb-search>
<sbb-autocomplete #auto="sbbAutocomplete">
  <sbb-option *ngFor="let option of filteredOptions" [value]="option">
    {{ option }}
  </sbb-option>
</sbb-autocomplete>
```

All use cases from sbb-autocomplete are supported: you can add static options, observable options,
and use option groups:

```html
<sbb-search
  mode="header"
  (search)="searchCallback(searchTerm)"
  placeholder="Suchen"
  [sbbAutocomplete]="auto"
></sbb-search>
<sbb-autocomplete #auto="sbbAutocomplete">
  <sbb-option *ngFor="let option of options$ | async" [value]="option">
    {{ option }}
  </sbb-option>
  <sbb-option-group label="Oft gesucht:">
    <sbb-option *ngFor="let option of staticOptions" [value]="option">
      {{ option }}
    </sbb-option>
  </sbb-option-group>
</sbb-autocomplete>
```

### Header mode

The `header` mode is activable by using the `mode` input property:

```html
<sbb-search mode="header" (search)="searchCallback(searchTerm)" placeholder="Suchen"></sbb-search>
```

The `placeholder` will also label the trigger.

### Custom icon

To set a custom icon to the search button (and to the trigger icon too when in 'header' mode),
you need to use the `sbbIcon` directive on the icon component you want to use:

```html
<sbb-search
  mode="header"
  (search)="searchCallback(searchTerm)"
  placeholder="Suchen"
  [formControl]="myControlStatic"
>
  <sbb-icon-circle-information *sbbIcon></sbb-icon-circle-information>
</sbb-search>
```
