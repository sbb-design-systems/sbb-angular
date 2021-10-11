The header will appear at the top of the screen in a fixed position, and provide a container
for navigation, usermenu and the logo.
It supports `<a>` and `<button>` tags for navigation. Optionally a `<sbb-usermenu>` can be
provided, as well as any element with a `[brand]` attribute or `.brand` class, for replacing
the standard logo.

```html
<sbb-header [label]="Title" [subtitle]="Subtitle">
  <sbb-header-environment [style.background]="environmentColor">example</sbb-header-environment>
  <a routerLink="/">Home</a>
  <button type="button" [sbbHeaderMenu]="menu">Sections</button>
  <sbb-header-menu #menu="sbbHeaderMenu">
    <!-- `Sections` or any other title is required as the header for mobile and tablet -->
    Sections
    <a sbbHeaderMenuItem routerLink="/nav1/section1" routerLinkActive="sbb-active">Section 1</a>
    <a sbbHeaderMenuItem routerLink="/nav1/section2" routerLinkActive="sbb-active">Section 2</a>
  </sbb-header-menu>
  <sbb-usermenu ...><!-- Optional --></sbb-usermenu>
  <svg brand><!-- Optional --></svg>
</sbb-header>
```

### Flexible mode

By adding the class `.sbb-header-flexible` to the `sbb-header` element, the default five column
layout is disabled and elements can be placed inside the header as desired. This will become the
default in a future release.

Use the `collapseBreakpoint` input to define on which breakpoint the header menus should be
collapsed. See the API documentation for more details.

```html
<sbb-header
  [label]="Title"
  [subtitle]="Subtitle"
  class="sbb-header-flexible"
  collapseBreakpoint="desktop"
>
  ...
</sbb-header>
```

### Environment

Use the `sbb-header-environment` to add a ribbon to describe the current environment (e.g. dev, test, int, ...).

Note: For the production environment, the `sbb-header-environment` is expected to be hidden.

```html
<sbb-header [label]="Title" [subtitle]="Subtitle">
  <sbb-header-environment>dev</sbb-header-environment>
</sbb-header>
```

We provide default colors for `edu`, `dev`, `test` and `int`. In order to configure your own color,
set the background color of `sbb-header-environment`. Note that the normalized text content of the
element will be added as a class in the format of `.sbb-header-environment-{text}`.

```html
<sbb-header [label]="Title" [subtitle]="Subtitle">
  <!-- Configure your own color -->
  <sbb-header-environment [style.background]="environmentColor">example</sbb-header-environment>
</sbb-header>
```

```scss
.sbb-header-environment-example {
  background-color: $sbbColorAutumn;
}
```

### App Chooser

It is possible to provide app chooser sections for links to other apps or external addresses.

```html
<sbb-header [label]="Title" [subtitle]="Subtitle">
  <a routerLink="/">Home</a>
  ...
  <sbb-app-chooser-section label="Apps">
    <a href="https://other-app.app.sbb.ch">Other App</a>
    <a href="https://alternative-app.app.sbb.ch">Alternative App</a>
  </sbb-app-chooser-section>
  <sbb-app-chooser-section label="Angular">
    <a href="https://angular.io">Angular</a>
  </sbb-app-chooser-section>
</sbb-header>
```
