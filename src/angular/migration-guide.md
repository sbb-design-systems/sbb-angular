# Migration Guide v12 to v13

This guide should help you migrate from `@sbb-esta/angular-public`, `@sbb-esta/angular-business`
and `@sbb-esta/angular-core` to `@sbb-esta/angular`.

**If you're using version 12 or below, please update `@sbb-esta/angular` to v13 first and avoid directly adding newer versions.
This migration guide doesn't contain changes which were made after version 13**

`@sbb-esta/angular` now contains all modules in either `standard` (previously public),
`lean` (previously business) or in both variants. If a module is only available for either
`standard` or `lean`, but not both, it will have a notification at the top of the documentation.
The default variant is `standard`. To use the `lean` variant, add the `sbb-lean` CSS class to the
`html` element (e.g. `<html class="sbb-lean" ...>`).

Most of the breaking changes should automatically be migrated via `ng add @sbb-esta/angular`
(see our [How to update](/howtoupdate) guide).

Please [reach out to us](https://github.com/sbb-design-systems/sbb-angular/issues/new/choose), if
one of these changes breaks your project in a non-recoverable way.

## Styling

In order to standardize css classes for an active router link, in
each component you should now use `sbb-active` class for `routerLinkActive`-attribute.
See also specific comments in component sections below.

## Secondary Entrypoints

_Automatic migration available_

The re-export from root (e.g. `import { SbbButtonModule } from '@sbb-esta/angular-public';`) has
been removed. All symbols have to be imported from the respective
module (e.g. `import { SbbButtonModule } from '@sbb-esta/angular/button';`).

## i18n

_Partial migration available_

Various translatables have been changed (new and removed ones).
Please run 'ng extract-i18n' and check the @sbb-esta/angular related translations.

The provided translation files have been moved to @sbb-esta/angular/i18n.

Please note, that also the i18n key 'sbbGhettoboxCloseGhettobox' have been renamed to 'sbbAlertCloseAlert'.

## Modules

### Accordion

No changes.

[Documentation](/angular/components/accordion)

### Autocomplete

No changes.

[Documentation](/angular/components/autocomplete)

### Badge

_Automatic migration available_

`<sbb-badge>` has been replaced with the `sbbBadge=""` directive.
This is a slight restriction, as we no longer allow HTML inside the badge. However, it was
never intended to be used in that way.

[Documentation](/angular/components/badge)

### Breadcrumb

_Automatic migration available_

The breadcrumb module has been refactored resulting in several changes.
Mainly the new `sbb-menu` replaces the `sbb-dropdown` but also improvements
to accessibility were made. All changes are handled by automatic migration.

- To define your root element (home icon) you can now simply define a
  link and apply the directive `<a sbb-breadcrumb-root>`.
  The responsibility to place the icon is taken over by the `sbb-breadcrumb` component.
  If you need a custom root, you have to add the `root` attribute to `sbb-breadcrumb` (`<sbb-breadcrumb root>`).

- All `<a sbbDropdownItem>` become `<a sbb-menu-item>` elements wrapped by a `<sbb-menu>`.
  The Trigger has to be defined by the developer and linked with
  the `<sbb-menu>` (see [Documentation](/angular/components/breadcrumb) for examples).

- In order to standardize sbb-active classes, all active classes should be `sbb-active`.
  In Breadcrumb context it means, the property `routerLinkActive`
  should now set to `sbb-active` (`sbb-selected` before).

The automatic migration wraps your menu trigger with `<ng-template sbbMenuDynamicTrigger>`.
If you only use text you can remove the `<ng-template>` tag.

[Documentation](/angular/components/breadcrumb)

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
which is no longer supported. The button component now provides an `svgIcon` input, for which
[any supported](/angular/icon-overview) (or self registered) icon can be used.

[Documentation](/angular/components/button)

### Captcha

No changes.

[Documentation](/angular/components/captcha)

### Checkbox

No changes.

[Documentation](/angular/components/checkbox)

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

[Documentation](/angular/components/checkbox-panel)

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

[Documentation](/angular/components/chips)

### Core

_Automatic migration available_

Most of the modules of `@sbb-esta/angular-core` have been moved to `@sbb-esta/angular/core` package.
Base classes (checkbox, processflow, radio-button and tooltip) have been moved to its corresponding modules.
The icon module was moved to `@sbb-esta/angular/icon` and the styles to `@sbb-esta/angular/styles`.

`SbbOptionGroup` was renamed to `SbbOptgroup` and its selector from `sbb-option-group` to `sbb-optgroup`.
With this renaming we now are closer to the browser's native `optgroup`.

`SbbBusinessDateAdapter` was renamed to `SbbLeanDateAdapter`
and `SBB_BUSINESS_DATE_ADAPTER` to `SBB_LEAN_DATE_ADAPTER`.

### Contextmenu

_Automatic migration available_

The contextmenu module has been integrated into the new more generic menu module, which also supports submenus.
Due to this change you have to define the contextmenu trigger yourself (the migration will take care of it),
and the contextmenu no longer depends on `SbbDropdown`. The APIs of `SbbDropdown` and `SbbMenu` have some differences,
so please check your code carefully after migration.
The width of a `sbb-menu-item` is not fixed anymore and adapts itself to the content. The width also can be overridden.

[Documentation](/angular/components/menu)

### Datepicker

_Automatic migration available_

The Datepicker has no significant changes. `SBB_BUSINESS_DATE_ADAPTER` was renamed to `SBB_LEAN_DATE_ADAPTER`.

[Documentation](/angular/components/datepicker)

### Dialog

_Automatic migration available_

We have renamed `SbbDialogHeader`/`[sbbDialogHeader]` to `SbbDialogTitle`/`[sbbDialogTitle]` and
`SbbDialogFooter`/`[sbbDialogFooter]` to `SbbDialogActions`/`[sbbDialogActions]` in order to more
accurately describe the purpose of these sections.

[Documentation](/angular/components/dialog)

### File Selector

_Automatic migration available_

The `FileTypeCategory` enum has been changed to a string literal type.

[Documentation](/angular/components/file-selector)

### Form Field & Input

_Automatic migration available_

The dependency order of the `SbbFormFieldModule` and `SbbInputModule` have been changed.
Previously the `SbbFormFieldModule` re-exported the `SbbInputModule`. However, since
`<sbb-form-field>` can be used without `sbbInput` (e.g. with `<sbb-select>`, `<sbb-chip-list>`,
`<sbb-textarea>`), but `sbbInput` has no purpose without a surrounding `<sbb-form-field>`,
we switched it up, so that `SbbFormFieldModule` no longer re-exports `SbbInputModule`, but now
`SbbInputModule` re-exports `SbbFormFieldModule`.
In order to minimize impact, we implemented a migration that replaces usage of `SbbFormFieldModule`
with `SbbInputModule`.

[Form Field Documentation](/angular/components/form-field)

[Input Documentation](/angular/components/input)

### Ghettobox (Alert)

_Partial migration available_

The former ghettobox module has been majorly refactored and is now called 'alert'.
With this renaming, every class and selector name has been changed of which the automatic migration takes care of.
Please note, that also the i18n key 'sbbGhettoboxCloseGhettobox' have been renamed to 'sbbAlertCloseAlert'.

The `routerLink` support for `<sbb-alert>` has been replaced with the `<a sbbAlert>` selector,
which allows improved configuration for linking to another site/page.
The output `afterDelete` on `<sbb-alert>` has been replaced with the `dismissed` output.
`<sbb-ghettobox-container>` has been replaced with `<sbb-alert-outlet>`, which more accurately
describes its purpose.
The API of `SbbAlertService` has also been changed and simplified.

Support for custom icon has been changed. Previously the `*sbbIcon` directive could be used,
which is no longer supported. The alert component now provides an `svgIcon` input, for which
[any supported](/angular/icon-overview) (or self registered) icon can be used.

See the documentation for details.

[Documentation](/angular/components/alert)

### Header

_Automatic migration available_

TODO

[Documentation](/angular/components/header-lean)

### Icon

_Automatic migration available_

The icon module has been moved from `@sbb-esta/angular-core` to `@sbb-esta/angular/icon`.

[Documentation](/angular/components/icon)

### Lightbox

_Automatic migration available_

We have renamed `SbbLightboxHeader`/`[sbbLightboxHeader]` to `SbbLightboxTitle`/`[sbbLightboxTitle]` and
`SbbLightboxFooter`/`[sbbLightboxFooter]` to `SbbLightboxActions`/`[sbbLightboxActions]` in order to more
accurately describe the purpose of these sections.
Also the property `manualCloseAction` on `SbbLightboxRef` has been renamed to `closeRequest` for the same reason.

[Documentation](/angular/components/lightbox)

### Links

_Automatic migration available_

The link module has been integrated into the button module. All button types can be used on both
`<a>` and `<button>`. The `sbbLink` selector has been renamed to `sbb-link`.

[Documentation](/angular/components/button)

### Loading

No changes.

[Documentation](/angular/components/loading)

### Notification

_Automatic migration available_

The `message` input has been removed. It should now be provided as content inside `<sbb-notification>`.
The input `toastPosition` has been removed. For this use case use the `notification-toast` module.

**Previous**

```html
<sbb-notification message="Example"></sbb-notification>
```

**New**

```html
<sbb-notification>Example</sbb-notification>
```

Support for custom icon has been changed. Previously the `*sbbIcon` directive could be used,
which is no longer supported. The notification component now provides an `svgIcon` input, for which
[any supported](/angular/icon-overview) (or self registered) icon can be used.
Alternatively the new element `<sbb-notification-icon>` can be used to wrap an icon.

[Documentation](/angular/components/notification)

### Notification Toast

_Automatic migration available_

`SbbNotificationVerticalPosition` has been renamed to `SbbNotificationToastVerticalPosition`.

[Documentation](/angular/components/notification-toast)

### Oauth

No changes.

[Documentation](/angular/components/oauth)

### Pagination

_Partial migration available_

The `sbb-pagination` component has been removed. From now on, only the `sbb-paginator` component can be used.
With the sbb-pagination component, the `length` property stood for the number of pages. With the sbb-paginator component,
the `length` property stands for the total number of items that are being paginated.
There is a new property `pageSize`, which determines the number of items on a page.
Additionally, the margin of `sbb-paginator` has been removed and can now be achieved by applying css divider classes.
Following design specs, `sbb-divider-small-top` should be used.

**Previous**

```html
<sbb-pagination (pageChange)="changePage($event)" length="5"></sbb-pagination>
```

**New**

```html
<sbb-paginator
  (page)="pageChange($event)"
  [pageSize]="10"
  [length]="50"
  class="sbb-divider-small-top"
></sbb-paginator>
```

If you have used the `selectByIndex` method, you should now use the setter `pageIndex` of SbbPaginator.

**Previous**

```ts
class Component {
  @ViewChild(SbbPagination) pagination: SbbPagination;

  constructor() {
    this.pagination.selectByIndex(2);
  }
}
```

**New**

```ts
class Component {
  @ViewChild(SbbPaginator) paginator: SbbPaginator;

  constructor() {
    this.paginator.pageIndex = 2;
  }
}
```

The `SbbPageChangeEvent` is now called `SbbPageEvent` and contains different properties than before.
You have to manually migrate them.

### Processflow

_Automatic migration available_

We refactored the processflow implementation on top of the
[CDK Stepper](https://material.angular.io/cdk/stepper/overview) implementation. This allows a
better integration into the Form handling from Angular and a few other features.
With this change, we have also removed the `skippable` input, but added the `linear` attribute.
Skippable is now essentially the default and the usage of `linear` (which is similar to the
previous non-skippable mode) is explained in the documentation linked below.
Also the methods `prevStep()` and `nextStep()` on `SbbProcessflow` have been renamed to
`previous()` and `next()`, the `<sbb-processflow-step>` selector and `SbbProcessflowStep` have been
renamed/changed to `<sbb-step>` and `SbbStep`.

[Documentation](/angular/components/processflow)

#### Styles

`sbb-paginator` and `sbb-navigation` don't reserve space around them anymore.
Please manually check the layout.

[Documentation](/angular/components/pagination)

### Radio Button

No changes.

[Documentation](/angular/components/radio-button)

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

[Documentation](/angular/components/radio-button-panel)

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

Support for custom icon has been changed. Previously the `*sbbIcon` directive could be used,
which is no longer supported. The search component now provides an `svgIcon` input, for which
[any supported](/angular/icon-overview) (or self registered) icon can be used.

[Documentation](/angular/components/search)

### Select

No changes.

[Documentation](/angular/components/select)

### Sidebar

No changes.

[Documentation](/angular/components/sidebar)

### Status

No changes.

[Documentation](/angular/components/status)

### Table

_Automatic migration available_

The former public `<sbb-table>` has been removed and will automatically be converted in a native table with sbb styles.
The only exception is the `pinMode` which is not automatically migrated. In this case, please convert your table to the
more powerful table attribute variant (`<table sbb-table>`) and use its sticky modes.
Alternatively, the sticky classes can be set manually.

The former business table (`<table sbbTable>`) is the basis for the new table module,
but it has a few breaking changes which are explained in the following sections.

The following selector renames have been performed. All renames are processed by the automatic migration.

| Previously           | New                    |
| -------------------- | ---------------------- |
| `<table sbbTable>`   | `<table sbb-table>`    |
| `<tr sbbHeaderRow>`  | `<tr sbb-header-row>`  |
| `<tr sbbRow>`        | `<tr sbb-row>`         |
| `<tr sbbFooterRow>`  | `<tr sbb-footer-row>`  |
| `<th sbbHeaderCell>` | `<th sbb-header-cell>` |
| `<sbbHeaderCell>`    | `<sbb-header-cell>`    |
| `<td sbbCell>`       | `<td sbb-cell>`        |
| `<sbbCell>`          | `<sbb-cell>`           |
| `<td sbbFooterCell>` | `<td sbb-footer-cell>` |
| `<sbbFooterCell>`    | `<sbb-footer-cell>`    |
| `[sbbSortHeader]`    | `[sbb-sort-header]`    |

- `SbbSortHeaderComponent` class was renamed to `SbbSortHeader`.
- `SbbSortDirective` class was renamed to `SbbSort`.
- `SbbSort` interface was renamed to `SbbSortState`.

- The deprecated css class `sbb-col-center-align` was removed and will automatically be replaced by `sbb-table-align-center`.

**SbbTableDataSource**

The group list constructor parameter of `SbbTableDataSource` was removed. Please use the
`groupWithNext` flag of `sbbColumnDef` or `sbb-text-column` to achieve a grouped column styling.
For more details consider the table documentation and examples.

**Table Wrapper**

As a new feature we provide the `<sbb-table-wrapper>` tag which can be used to make the table scrollable.
If using sticky rows or columns, the `<sbb-table-wrapper>` is mandatory.

```html
<sbb-table-wrapper>
  <table sbb-table>
    ...
  </table>
</sbb-table-wrapper>
```

**Styling**

Lean styles have slightly changed due to new specifications.

**We don't provide default styles anymore for a native `<table>` in the typography.**
Please always add the `sbb-table` css class to your `<table>` if you need a sbb styled table (e.g. `<table class="sbb-table">`).

As a new feature, the css class `sbb-table-row-selected` was introduced which can conditionally be applied on a `<tr>`-tag.
If your row allows selecting it, this class would style the row correctly.

If using `SelectionModel`, it could look like the following example.
Please also consult the working example in the examples section of the table.

```html
<table sbb-table>
  ...
  <tr
    sbb-row
    *sbbRowDef="let row; columns: displayedColumns"
    (click)="selection.toggle(row)"
    [class.sbb-table-row-selected]="selection.isSelected(row)"
  ></tr>
  ...
</table>
```

[Documentation](/angular/components/table)

### Tabs

_Partial migration available_

The tabs module has been refactored to improve programmatic access. We have also created a
separate variant that can be used with `<router-outlet>`.
Due to a structural change, we have renamed `<sbb-tabs>` to `<sbb-tab-group>`.
The `active`, `labelId` and `badgePill` properties on `<sbb-tab>` have been removed. A badge pill
can be applied with the `sbbBadge` directive from the `SbbBadgeModule`.
To set a tab active, use the `selectedIndex` input on `sbb-tab-group`. Hint: Each `sbb-tab` has a `position` property
which represents the index in its parent `sbb-tab-group`.

**Previous**

```html
<sbb-tabs>
  <sbb-tab label="Notes" [active]="true"></sbb-tab>
  <sbb-tab label="Messages" [badgePill]="5"></sbb-tab>
</sbb-tabs>
```

**New**

```html
<sbb-tab-group [selectedIndex]="0">
  <sbb-tab label="Notes"></sbb-tab>
  <sbb-tab>
    <span *sbb-tab-label sbbBadge="5">Messages</span>
  </sbb-tab>
</sbb-tab-group>
```

[Documentation](/angular/components/tabs)

### Tag

_Partial migration available_

The tag module has been slightly refactored.

#### '<sbb-tag>'

The `label` inputs has been changed to content projection which is handled by automatic migration:

**Previous**

```html
<sbb-tag label="Trains" amount="5"></sbb-tag>
```

**New**

```html
<sbb-tag amount="5">Trains</sbb-tag>
```

#### Tag Link

The usage of the tag link has changed (no automatic migration):

**Previous**

```html
<a href="#">
  <sbb-tag label="Trains" amount="5"></sbb-tag>
</a>
```

**New**

```html
<a href="#" sbb-tag-link amount="5">Trains</a>
```

#### Accessibility

Additionally, it's now possible to set the aria description of the badge by using `[sbbBadgeDescription]` property
on `<sbb-tag>` or on `sbb-tag-link`. As a fallback, the predefined aria labels will still be applied
so that in most cases no action is required.

[Documentation](/angular/components/tag)

### Textarea

No changes.

[Documentation](/angular/components/textarea)

### Textexpand

No changes.

[Documentation](/angular/components/textexpand)

### Time Input

No changes.

[Documentation](/angular/components/time-input)

### Toggle

_Automatic migration available_

Support for custom icon has been changed. Previously the `*sbbIcon` directive could be used,
which is no longer supported. The toggle option component now provides an `svgIcon` input, for which
[any supported](/angular/icon-overview) (or self registered) icon can be used.
Alternatively the new element `<sbb-toggle-icon>` can be used to wrap an icon.

**Previous**

```html
<sbb-toggle-option label="Option 1" value="dog">
  <sbb-icon svgIcon="kom:arrows-right-left-small" *sbbIcon></sbb-icon>
</sbb-toggle-option>
<sbb-toggle-option label="Option 2" value="cat">
  <sbb-icon svgIcon="kom:arrows-right-left-small" *sbbIcon></sbb-icon>
</sbb-toggle-option>
```

**New**

```html
<sbb-toggle-option label="Option 1" value="cat" svgIcon="kom:arrows-right-left-small">
</sbb-toggle-option>
<sbb-toggle-option label="Option 2" value="cat">
  <sbb-toggle-icon>
    <sbb-icon svgIcon="kom:arrows-right-left-small"></sbb-icon>
  </sbb-toggle-icon>
</sbb-toggle-option>
```

It was also previously possible to have any content inside `<sbb-toggle-option>` appear
as content when the option was selected. This content now needs to be wrapped in `<sbb-toggle-details>`.

**Previous**

```html
<sbb-toggle-option label="Option 1" value="dog"> Example </sbb-toggle-option>
```

**New**

```html
<sbb-toggle-option label="Option 1" value="dog">
  <sbb-toggle-details>Example</sbb-toggle-details>
</sbb-toggle-option>
```

[Documentation](/angular/components/toggle)

### Tooltip

_Partial migration available_

`sbb-tooltip` has been refactored to internally use `sbbTooltip`. `SbbTooltipComponent` has been
renamed to `SbbTooltipWrapper` and its methods `open` and `close` have been renamed to `show` and
`hide` to align with the directive usage. The `closed` output was renamed to `dismissed`.

Support for custom icon has been changed. Previously the `*sbbIcon` directive could be used,
which is no longer supported. The tooltip component now provides an `svgIcon` input, for which
[any supported](/angular/icon-overview) (or self registered) icon can be used.

[Documentation](/angular/components/tooltip)

### Usermenu

_Automatic migration available_

The `sbb-usermenu` has been refactored to be used with the new `sbb-menu`. Therefore, the usage has been modified as following:

**before**

```html
<sbb-usermenu [userName]="userName" (loginRequest)="login()">
  <button type="button" sbb-usermenu-item>Action Button</button>
  <button type="button" sbb-usermenu-item (click)="logout()">Logout</button>
</sbb-usermenu>
```

**after**

```html
<sbb-usermenu [userName]="userName" (loginRequest)="login()" [menu]="menu"></sbb-usermenu>
<sbb-menu #menu="sbbMenu">
  <button type="button" sbb-menu-item>Action</button>
  <button type="button" sbb-menu-item (click)="logout()">Logout</button>
</sbb-menu>
```

Additionally, the css class of routerLinkActive of usermenu items was renamed from `sbb-selected` to `sbb-active`.

**before**

```html
<sbb-usermenu>
  <a sbb-usermenu-item routerLink="." routerLinkActive="sbb-selected"> Account </a>
</sbb-usermenu>
```

**after**

```html
<sbb-menu #menu="sbbMenu">
  <a sbb-menu-item routerLink="." routerLinkActive="sbb-active"> Account </a>
</sbb-menu>
```

[Documentation](/angular/components/usermenu)
