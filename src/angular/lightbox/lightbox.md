The `SbbLightbox` service can be used to open modal dialogs with SBB styling and animations.

```html
<div sbbLightboxTitle>Hi {{ data.name }}</div>
<div sbbLightboxContent>
  <div>
    What's your favorite animal?
    <sbb-form-field label="Animal">
      <input type="text" [(ngModel)]="data.animal" cdkFocusInitial />
    </sbb-form-field>
  </div>
</div>
<div sbbLightboxActions>
  <button type="button" sbb-button [sbbLightboxClose]="data.animal">Ok</button>
  <button type="button" sbb-secondary-button (click)="noThanks()">No Thanks</button>
</div>
```

A lightbox is opened by calling the `open` method with a component to be loaded and an optional
config object. The `open` method will return an instance of `SbbLightboxRef`:

```ts
let lightboxRef = lightbox.open(UserProfileComponent, {
  ...
});
```

The `SbbLightboxRef` provides a handle on the opened lightbox. It can be used to close the lightbox and to
receive notifications when the lightbox has been closed. Any notification Observables will complete when the lightbox closes.

```ts
lightboxRef.afterClosed().subscribe((result) => {
  console.log(`Lightbox result: ${result}`); // Pizza!
});

lightboxRef.close('Pizza!');
```

Components created via `SbbLightbox` can _inject_ `SbbLightboxRef` and use it to close the lightbox
in which they are contained. When closing, an optional result value can be provided. This result
value is forwarded as the result of the `afterClosed` Observable.

```ts
@Component({
  /* ... */
})
export class YourLightbox {
  constructor(public lightboxRef: SbbLightboxRef<YourLightbox>) {}

  closeLightbox() {
    this.lightboxRef.close('Pizza!');
  }
}
```

### Specifying global configuration defaults

Default lightbox options can be specified by providing an instance of `SbbLightboxConfig` for
SBB_LIGHTBOX_DEFAULT_OPTIONS in your application's root module.

```ts
@NgModule({
  providers: [
    {provide: SBB_LIGHTBOX_DEFAULT_OPTIONS, useValue: { disableClose: true }}
  ]
})
```

### Sharing data with the Lightbox component.

If you want to share data with your lightbox, you can use the `data`
option to pass information to the lightbox component.

```ts
let lightboxRef = lightbox.open(YourLightbox, {
  data: { name: 'bern' },
});
```

To access the data in your lightbox component, you have to use the SBB_LIGHTBOX_DATA injection token:

```ts
import { Component, Inject } from '@angular/core';
import { SBB_LIGHTBOX_DATA } from '@sbb-esta/angular/lightbox';

@Component({
  selector: 'your-lightbox',
  template: 'passed in {{ data.name }}',
})
export class YourLightbox {
  constructor(@Inject(SBB_LIGHTBOX_DATA) public data: { name: string }) {}
}
```

Note that if you're using a template lightbox (one that was opened with a `TemplateRef`), the data
will be available implicitly in the template:

```html
<ng-template let-data> Hello, {{data.name}} </ng-template>
```

### Lightbox content

Several directives are available to make it easier to structure your lightbox content:

| Name                     | Description                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `<sbb-lightbox-title>`   | Lightbox title section.                                                                                          |
| `<sbb-lightbox-content>` | Primary scrollable content of the lightbox.                                                                      |
| `<sbb-lightbox-actions>` | Container for action buttons at the bottom of the lightbox.                                                      |
| `sbb-lightbox-close`     | \[Attr] Added to a `<button>`, makes the button close the lightbox with an optional result from the bound value. |

For example:

```html
<h2 sbb-lightbox-title>Delete all elements?</h2>
<sbb-lightbox-content
  >This will delete all elements that are currently on this page and cannot be
  undone.</sbb-lightbox-content
>
<sbb-lightbox-actions>
  <!-- The sbb-lightbox-close directive optionally accepts a value as a result for the lightbox. -->
  <button sbb-button [sbb-lightbox-close]="true">Delete</button>
  <button sbb-secondary-button sbb-lightbox-close>Cancel</button>
</sbb-lightbox-actions>
```

Once a lightbox opens, the lightbox will automatically focus the first tabbable element.

You can control which elements are tab stops with the `tabindex` attribute

```html
<button sbb-button tabindex="-1">Not Tabbable</button>
```

### Accessibility

`SbbLightbox` creates modal dialogs that implements the ARIA `role="dialog"` pattern by default.
You can change the lightbox's role to `alertdialog` via `SbbLightboxConfig`.

You should provide an accessible label to this root lightbox element by setting the `ariaLabel` or
`ariaLabelledBy` properties of `SbbLightboxConfig`. You can additionally specify a description element
ID via the `ariaDescribedBy` property of `SbbLightboxConfig`.

#### Keyboard interaction

By default, the escape key closes `SbbLightbox`. While you can disable this behavior via
the `disableClose` property of `SbbLightboxConfig`, doing this breaks the expected interaction
pattern for the ARIA `role="dialog"` pattern.

#### Focus management

When opened, `SbbLightbox` traps browser focus such that it cannot escape the root
`role="dialog"` element. By default, the first tabbable element in the lightbox receives focus.
You can customize which element receives focus with the `autoFocus` property of
`SbbLightboxConfig`, which supports the following values.

| Value            | Behavior                                                             |
| ---------------- | -------------------------------------------------------------------- |
| `first-tabbable` | Focus the first tabbable element. This is the default setting.       |
| `first-header`   | Focus the first header element (`role="heading"`, `h1` through `h6`) |
| `dialog`         | Focus the root `role="dialog"` element.                              |
| Any CSS selector | Focus the first element matching the given selector.                 |

While the default setting applies the best behavior for most applications, special cases may benefit
from these alternatives. Always test your application to verify the behavior that works best for
your users.

#### Focus restoration

When closed, `SbbLightbox` restores focus to the element that previously held focus when the
lightbox opened. However, if that previously focused element no longer exists, you must
add additional handling to return focus to an element that makes sense for the user's workflow.
Opening a lightbox from a menu is one common pattern that causes this situation. The menu
closes upon clicking an item, thus the focused menu item is no longer in the DOM when the bottom
sheet attempts to restore focus.

You can add handling for this situation with the `afterClosed()` observable from `SbbLightboxRef`.

```ts
// #docregion focus-restoration
const lightboxRef = this.dialog.open(ExampleLightbox, { restoreFocus: false });

// Manually restore focus to the menu trigger since the element that
// opens the lightbox won't be in the DOM any more when the lightbox closes.
lightboxRef.afterClosed().subscribe(() => this.menuTrigger.focus());
```
