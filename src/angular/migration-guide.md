# Migration Guide

This guide should help you migrate from `@sbb-esta/angular-public`, `@sbb-esta/angular-business`
and `@sbb-esta/angular-core` to `@sbb-esta/angular`.

`@sbb-esta/angular` now contains all modules in either `standard` (previously public),
`lean` (previously business) or in both variants. If a module is only available for either
`standard` or `lean`, but not both, it will have a notification at the top of the documentation.
The default variant is `standard`. To use the `lean` variant, add the `sbb-lean` CSS class to the
`html` element (e.g. `<html class="sbb-lean" ...>`).

Most of the breaking changes should automatically be migrated via `ng update`
(see our [How to update](howtoupdate) guide).

Please [reach out to us](https://github.com/sbb-design-systems/sbb-angular/issues/new/choose), if
one of these changes breaks your project in a non-recoverable way.

### Styling

In order to standardize css classes for an active router link, in
each component you should now use `sbb-active` class for `routerLinkActive`-attribute.
See also specific comments in component sections below.

### Secondary Entrypoints

_Automatic migration available_

The re-export from root (e.g. `import { SbbButtonModule } from '@sbb-esta/angular-public';`) has
been removed. All symbols have to be imported from the respective
module (e.g. `import { SbbButtonModule } from '@sbb-esta/angular/button';`).

### Badge

_Automatic migration available_

`<sbb-badge>` has been replaced with the `sbbBadge=""` directive.
This is a slight restriction, as we no longer allow HTML inside the badge. However it was
never intended to be used in that way.

[Documentation](angular/components/badge)

### Breadcrumb

_Automatic migration available_

The breadcrumb module has been refactored resulting in several changes.
Mainly the new `sbb-menu` replaces the `sbb-dropdown` but also improvements
to accessibility were made. All changes are handled by automatic migration.

- To define your root element (home icon) you can now simply define a
  link and apply the directive `<a sbb-breadcrumb-root>`.
  The responsibility to place the icon is taken over by the `sbb-breadcrumb` component.

- All `<a sbbDropdownItem>` become `<a sbb-menu-item>` elements wrapped by a `<sbb-menu>`.
  The Trigger has to be defined by the developer and linked with
  the `<sbb-menu>` (see [Documentation](angular/components/breadcrumb) for examples).

- In order to standardize sbb-active classes, all active classes should be `sbb-active`.
  In Breadcrumb context it means, the property `routerLinkActive`
  should now set to `sbb-active` (`sbb-selected` before).

The automatic migration wraps your menu trigger with `<ng-template sbbMenuDynamicTrigger>`.
If you only use text you can remove the `<ng-template>` tag.

[Documentation](angular/components/breadcrumb)

### Button

_Automatic migration available_

The button module has been refactored from the ground up. The `sbbButton` selector with the `mode`
input has been split into separate selectors.

| Previously                              | New                             |
| --------------------------------------- | ------------------------------- |
| `<button sbbButton>`                    | `<button sbb-button>`           |
| `<button sbbButton mode="primary">`     | `<button sbb-button>`           |
| `<button sbbButton mode="secondary">`   | `<button sbb-secondary-button>` |
| `<button sbbButton mode="ghost">`       | `<button sbb-ghost-button>`     |
| `<button sbbButton mode="frameless">`   | `<button sbb-frameless-button>` |
| `<button sbbButton mode="alternative">` | `<button sbb-alt-button>`       |
| `<button sbbButton mode="icon">`        | `<button sbb-icon-button>`      |

Support for custom icon has been changed. Previously the `*sbbIcon` directive could be used,
which is no longer supported. The button component now provides an `indicatorIcon` input, for which
[any supported](angular/icon-overview) (or self registered) icon can be used.

[Documentation](angular/components/button)

### Checkbox Panel

_Automatic migration available_

The checkbox panel module structure has been refactored. The `label` and `subtitle` inputs have
been changed to content projection and the `sbbIcon` content projection has been replaced with
the generic `<sbb-checkbox-panel-note>` wrapper.

**Previous**

```html
<sbb-checkbox-panel label="Example Label" subtitle="Subtitle">
  <sbb-icon svgIcon="kom:heart-small" sbbIcon></sbb-icon>
</sbb-checkbox-panel>
```

**New**

```html
<sbb-checkbox-panel subtitle="">
  Example Label
  <sbb-checkbox-panel-subtitle>Subtitle</sbb-checkbox-panel-subtitle>
  <sbb-checkbox-panel-note
    ><sbb-icon svgIcon="kom:heart-small" sbbIcon></sbb-icon
  ></sbb-checkbox-panel-note>
</sbb-checkbox-panel>
```

[Documentation](angular/components/checkbox-panel)

### Chip Input

_Automatic migration available_

The Chip Input has been recreated from scratch. The module is now a lot more flexible and controllable
by developers but needs a little more of template code.

**Previous**

```html
<sbb-chip-input [formControl]="formControl"></sbb-chip-input>
```

**New**

```html
<sbb-chip-list aria-label="Locomotives" [formControl]="formControl">
  <sbb-chip *ngFor="let element of formControl.value" [value]="element">{{ element }}</sbb-chip>
  <input sbbChipInput placeholder="New locomotive..." />
</sbb-chip-list>
```

Please carefully check the changes from the automatic migration and manually add aria-label and placeholder as required.

[Documentation](angular/components/chips)

### Datepicker

_Automatic migration available_

The Datepicker has no significant changes. `SBB_BUSINESS_DATE_ADAPTER` was renamed to `SBB_LEAN_DATE_ADAPTER`.

[Documentation](angular/components/datepicker)

### File Selector

_Automatic migration available_

The `FileTypeCategory` enum has been changed to a string literal type.

[Documentation](angular/components/file-selector)

### Links

_Automatic migration available_

The link module has been integrated into the button module. All button types can be used on both
`<a>` and `<button>`. The `sbbLink` selector has been renamed to `sbb-link`.

[Documentation](angular/components/button)

### Contextmenu

_Automatic migration available_

The contextmenu module has been integrated into the new more generic menu module, which also supports submenus.
Due to this change you have to define the contextmenu trigger yourself (the migration will take care of it),
and the contextmenu no longer depends on `SbbDropdown`. The APIs of `SbbDropdown` and `SbbMenu` have some differences,
so please check your code carefully after migration.
The width of a `sbb-menu-item` is not fixed anymore and adapts itself to the content. The width also can be overridden.

[Documentation](angular/components/menu)

### Radio Button Panel

_Automatic migration available_

The radio button panel module structure has been refactored. The `label` and `subtitle` inputs have
been changed to content projection and the `sbbIcon` content projection has been replaced with
the generic `<sbb-radio-button-panel-note>` wrapper.

**Previous**

```html
<sbb-radio-button-panel label="Example Label" subtitle="Subtitle">
  <sbb-icon svgIcon="kom:heart-small" sbbIcon></sbb-icon>
</sbb-radio-button-panel>
```

**New**

```html
<sbb-radio-button-panel subtitle="">
  Example Label
  <sbb-radio-button-panel-subtitle>Subtitle</sbb-radio-button-panel-subtitle>
  <sbb-radio-button-panel-note
    ><sbb-icon svgIcon="kom:heart-small" sbbIcon></sbb-icon
  ></sbb-radio-button-panel-note>
</sbb-radio-button-panel>
```

[Documentation](angular/components/radio-button-panel)

### Search

_Automatic migration available_

The search component has been refactored as a wrapper for an input field.

**Previous**

```html
<sbb-search placeholder="Search" [formControl]="searchControl"> </sbb-search>
```

**New**

```html
<sbb-search (search)="handleSearch($event)">
  <input sbbInput [formControl]="searchControl" />
</sbb-search>
```

[Documentation](angular/components/search)
