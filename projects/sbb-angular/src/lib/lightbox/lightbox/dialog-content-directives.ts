/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Directive,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  ElementRef,
} from '@angular/core';
import { MatDialog } from './dialog';
import { MatDialogRef } from './dialog-ref';

/** Counter used to generate unique IDs for dialog elements. */
let dialogElementUid = 0;

/**
 * Button that will close the current dialog.
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: `button[mat-dialog-close], button[matDialogClose]`,
  exportAs: 'matDialogClose',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(click)': 'dialogRef.close(dialogResult)',
    '[attr.aria-label]': 'ariaLabel',
    'type': 'button', // Prevents accidental form submits.
  }
})
// tslint:disable-next-line:directive-class-suffix
export class MatDialogClose implements OnInit, OnChanges {
  /** Screenreader label for the button. */
  // tslint:disable-next-line:no-input-rename
  @Input('aria-label') ariaLabel = 'Close dialog';

  /** Dialog close input. */
  // tslint:disable-next-line:no-input-rename
  @Input('mat-dialog-close') dialogResult: any;

  // tslint:disable-next-line:no-input-rename
  @Input('matDialogClose') _matDialogClose: any;

  constructor(
    @Optional() public dialogRef: MatDialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: MatDialog) { }

  ngOnInit() {
    if (!this.dialogRef) {
      // When this directive is included in a dialog via TemplateRef (rather than being
      // in a Component), the DialogRef isn't available via injection because embedded
      // views cannot be given a custom injector. Instead, we look up the DialogRef by
      // ID. This must occur in `onInit`, as the ID binding for the dialog container won't
      // be resolved at constructor time.
      // tslint:disable-next-line:no-non-null-assertion
      this.dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs)!;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const proxiedChange = changes._matDialogClose || changes._matDialogCloseResult;

    if (proxiedChange) {
      this.dialogResult = proxiedChange.currentValue;
    }
  }
}

/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[mat-dialog-title], [matDialogTitle]',
  exportAs: 'matDialogTitle',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    'class': 'mat-dialog-title',
    '[id]': 'id',
  },
})
// tslint:disable-next-line:directive-class-suffix
export class MatDialogTitle implements OnInit {
  @Input() id = `mat-dialog-title-${dialogElementUid++}`;

  constructor(
    @Optional() private _dialogRef: MatDialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: MatDialog) { }

  ngOnInit() {
    if (!this._dialogRef) {
      // tslint:disable-next-line:no-non-null-assertion
      this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs)!;
    }

    if (this._dialogRef) {
      Promise.resolve().then(() => {
        const container = this._dialogRef._containerInstance;

        if (container && !container._ariaLabelledBy) {
          container._ariaLabelledBy = this.id;
        }
      });
    }
  }
}


/**
 * Scrollable content container of a dialog.
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: `[mat-dialog-content], mat-dialog-content, [matDialogContent]`,
  // tslint:disable-next-line:use-host-property-decorator
  host: { 'class': 'mat-dialog-content' }
})
export class MatDialogContent { }


/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: `[mat-dialog-actions], mat-dialog-actions, [matDialogActions]`,
  // tslint:disable-next-line:use-host-property-decorator
  host: { 'class': 'mat-dialog-actions' }
})
// tslint:disable-next-line:directive-class-suffix
export class MatDialogActions { }


/**
 * Finds the closest MatDialogRef to an element by looking at the DOM.
 * @param element Element relative to which to look for a dialog.
 * @param openDialogs References to the currently-open dialogs.
 */
function getClosestDialog(element: ElementRef<HTMLElement>, openDialogs: MatDialogRef<any>[]) {
  let parent: HTMLElement | null = element.nativeElement.parentElement;

  while (parent && !parent.classList.contains('mat-dialog-container')) {
    parent = parent.parentElement;
  }

  return parent ? openDialogs.find(dialog => dialog.id === parent!.id) : null;
}
