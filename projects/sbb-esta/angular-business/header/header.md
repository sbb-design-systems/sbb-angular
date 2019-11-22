The header will appear at the top of the screen in a fixed position, and provide a container
for navigation, usermenu and the logo.
It supports `<a>` and `<button>` tags for navigation. Optionally a `<sbb-usermenu>` can be
provided, as well as any element with a `[brand]` attribute or `.brand` class, for replacing
the standard logo.

**Note: The responsive design is still experimental.**

```html
<sbb-header [label]="Title" [subtitle]="Subtitle" [environment]="dev" [environmentColor]="red">
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

### App Chooser

It is possible to provide app chooser sections for links to other apps or external addresses.

```html
<sbb-header [label]="Title" [subtitle]="Subtitle" [environment]="dev" [environmentColor]="red">
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
