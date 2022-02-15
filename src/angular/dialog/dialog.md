The `SbbDialog` service can be used to open modal dialogs with SBB styling and animations.

```html
<div sbbDialogTitle>Hi {{ data.name }}</div>
<div sbbDialogContent>
  <div>
    What's your favorite animal?
    <sbb-form-field label="Animal">
      <input type="text" [(ngModel)]="data.animal" cdkFocusInitial />
    </sbb-form-field>
  </div>
</div>
<div sbbDialogActions>
  <button type="button" sbb-button [sbbDialogClose]="data.animal">Ok</button>
  <button type="button" sbb-secondary-button (click)="noThanks()">No Thanks</button>
</div>
```

A dialog is opened by calling the `open` method with a component to be loaded and an optional
config object. The `open` method will return an instance of `SbbDialogRef`:

```ts
let dialogRef = dialog.open(UserProfileComponent, {
  ...
});
```

The `SbbDialogRef` provides a handle on the opened dialog. It can be used to close the dialog and to
receive notifications when the dialog has been closed. Any notification Observables will complete when the dialog closes.

```ts
dialogRef.afterClosed().subscribe((result) => {
  console.log(`Dialog result: ${result}`); // Pizza!
});

dialogRef.close('Pizza!');
```

Components created via `SbbDialog` can _inject_ `SbbDialogRef` and use it to close the dialog
in which they are contained. When closing, an optional result value can be provided. This result
value is forwarded as the result of the `afterClosed` Observable.

```ts
@Component({
  /* ... */
})
export class YourDialog {
  constructor(public dialogRef: SbbDialogRef<YourDialog>) {}

  closeDialog() {
    this.dialogRef.close('Pizza!');
  }
}
```

### Specifying global configuration defaults

Default dialog options can be specified by providing an instance of `SbbDialogConfig` for
SBB_DIALOG_DEFAULT_OPTIONS in your application's root module.

```ts
@NgModule({
  providers: [
    {provide: SBB_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ]
})
```

### Sharing data with the Dialog component.

If you want to share data with your dialog, you can use the `data`
option to pass information to the dialog component.

```ts
let dialogRef = dialog.open(YourDialog, {
  data: { name: 'bern' },
});
```

To access the data in your dialog component, you have to use the SBB_DIALOG_DATA injection token:

```ts
import { Component, Inject } from '@angular/core';
import { SBB_DIALOG_DATA } from '@sbb-esta/angular/dialog';

@Component({
  selector: 'your-dialog',
  template: 'passed in {{ data.name }}',
})
export class YourDialog {
  constructor(@Inject(SBB_DIALOG_DATA) public data: { name: string }) {}
}
```

Note that if you're using a template dialog (one that was opened with a `TemplateRef`), the data
will be available implicitly in the template:

```html
<ng-template let-data> Hello, {{data.name}} </ng-template>
```

### Dialog content

Several directives are available to make it easier to structure your dialog content:

| Name                   | Description                                                                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sbb-dialog-title`     | \[Attr] Dialog title, applied to a heading element (e.g., `<h1>`, `<h2>`)                                                                                              |
| `<sbb-dialog-content>` | Primary scrollable content of the dialog.                                                                                                                              |
| `<sbb-dialog-actions>` | Container for action buttons at the bottom of the dialog. Button alignment can be controlled via the `align` attribute which can be set to `start`, `center` or `end`. |
| `sbb-dialog-close`     | \[Attr] Added to a `<button>`, makes the button close the dialog with an optional result from the bound value.                                                         |

For example:

```html
<h2 sbb-dialog-title>Delete all elements?</h2>
<sbb-dialog-content
  >This will delete all elements that are currently on this page and cannot be
  undone.</sbb-dialog-content
>
<sbb-dialog-actions>
  <!-- The sbb-dialog-close directive optionally accepts a value as a result for the dialog. -->
  <button sbb-button [sbb-dialog-close]="true">Delete</button>
  <button sbb-secondary-button sbb-dialog-close>Cancel</button>
</sbb-dialog-actions>
```

Once a dialog opens, the dialog will automatically focus the first tabbable element.

You can control which elements are tab stops with the `tabindex` attribute

```html
<button sbb-button tabindex="-1">Not Tabbable</button>
```

### Accessibility

`SbbDialog` creates modal dialogs that implements the ARIA `role="dialog"` pattern by default.
You can change the dialog's role to `alertdialog` via `SbbDialogConfig`.

You should provide an accessible label to this root dialog element by setting the `ariaLabel` or
`ariaLabelledBy` properties of `SbbDialogConfig`. You can additionally specify a description element
ID via the `ariaDescribedBy` property of `SbbDialogConfig`.

#### Keyboard interaction

By default, the escape key closes `SbbDialog`. While you can disable this behavior via
the `disableClose` property of `SbbDialogConfig`, doing this breaks the expected interaction
pattern for the ARIA `role="dialog"` pattern.

#### Focus management

When opened, `SbbDialog` traps browser focus such that it cannot escape the root
`role="dialog"` element. By default, the first tabbable element in the dialog receives focus.
You can customize which element receives focus with the `autoFocus` property of
`SbbDialogConfig`, which supports the following values.

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

When closed, `SbbDialog` restores focus to the element that previously held focus when the
dialog opened. However, if that previously focused element no longer exists, you must
add additional handling to return focus to an element that makes sense for the user's workflow.
Opening a dialog from a menu is one common pattern that causes this situation. The menu
closes upon clicking an item, thus the focused menu item is no longer in the DOM when the bottom
sheet attempts to restore focus.

You can add handling for this situation with the `afterClosed()` observable from `SbbDialogRef`.

```ts
// #docregion focus-restoration
const dialogRef = this.dialog.open(DialogFromMenuExampleDialog, { restoreFocus: false });

// Manually restore focus to the menu trigger since the element that
// opens the dialog won't be in the DOM any more when the dialog closes.
dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
```
