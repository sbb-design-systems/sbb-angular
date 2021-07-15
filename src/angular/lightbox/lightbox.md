The `SbbLightbox` service can be used to open modal dialogs with SBB styling and animations.

```html
<div sbbLightboxHeader>Hi {{ data.name }}</div>
<div sbbLightboxContent>
  <div>
    What's your favorite animal?
    <sbb-form-field label="Animal">
      <input type="text" [(ngModel)]="data.animal" cdkFocusInitial />
    </sbb-form-field>
  </div>
</div>
<div sbbLightboxFooter>
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

| Name                     | Description                                                                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<sbb-lightbox-title>`   | Lightbox title section.                                                                                                                                          |
| `<sbb-lightbox-content>` | Primary scrollable content of the lightbox.                                                                                                                      |
| `<sbb-lightbox-actions>` | Container for action buttons at the bottom of the lightbox. Button alignment can be controlled via the `align` attribute which can be set to `end` and `center`. |
| `sbb-lightbox-close`     | \[Attr] Added to a `<button>`, makes the button close the lightbox with an optional result from the bound value.                                                 |

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

By default, each lightbox has `role="dialog"` on the root element. The role can be changed to
`alertdialog` via the `SbbLightboxConfig` when opening.

The `aria-label`, `aria-labelledby`, and `aria-describedby` attributes can all be set to the
dialog element via the `SbbLightboxConfig` as well. Each lightbox should typically have a label
set via `aria-label` or `aria-labelledby`.

When a lightbox is opened, it will move focus to the first focusable element that it can find. In
order to prevent users from tabbing into elements in the background, the lightbox uses
a [focus trap](https://sbberial.angular.io/cdk/a11y/overview#focustrap) to contain focus
within itself. Once a lightbox is closed, it will return focus to the element that was focused
before the lightbox was opened.

#### Focus management

By default, the first tabbable element within the lightbox will receive focus upon open. This can
be configured by setting the `cdkFocusInitial` attribute on another focusable element.

Tabbing through the elements of the lightbox will keep focus inside of the dialog element,
wrapping back to the first tabbable element when reaching the end of the tab sequence.

#### Focus Restoration

Upon closing, the lightbox returns focus to the element that had focus when the lightbox opened.
In some cases, however, this previously focused element no longer exists in the DOM, such as
menu items. To manually restore focus to an appropriate element in such cases, you can disable
`restoreFocus` in `SbbLightboxConfig` and pass it into the `open` method.
Then you can return focus manually by subscribing to the `afterClosed` observable on `SbbLightboxRef`.

#### Keyboard interaction

By default pressing the escape key will close the lightbox. While this behavior can
be turned off via the `disableClose` option, users should generally avoid doing so
as it breaks the expected interaction pattern for screen-reader users.
