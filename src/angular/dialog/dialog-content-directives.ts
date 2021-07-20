// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {
  Component,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
} from '@angular/core';

import { SbbDialog } from './dialog';
import { SbbDialogRef, _closeDialogVia } from './dialog-ref';

/** Counter used to generate unique IDs for dialog elements. */
let dialogElementUid = 0;

/**
 * Button that will close the current dialog.
 */
@Directive({
  selector: '[sbb-dialog-close], [sbbDialogClose]',
  exportAs: 'sbbDialogClose',
  host: {
    '[attr.aria-label]': 'ariaLabel || null',
    '[attr.type]': 'type',
  },
})
export class SbbDialogClose implements OnInit, OnChanges {
  /** Screenreader label for the button. */
  @Input('aria-label') ariaLabel: string =
    typeof $localize === 'function'
      ? $localize`:Aria label to close a dialog@@sbbDialogCloseDialog:Close dialog`
      : 'Close dialog';

  /** Default to "button" to prevents accidental form submits. */
  @Input() type: 'submit' | 'button' | 'reset' = 'button';

  /** Dialog close input. */
  @Input('sbb-dialog-close') dialogResult: any;

  @Input('sbbDialogClose') _sbbDialogClose: any;

  constructor(
    // The dialog title directive is always used in combination with a `SbbDialogRef`.
    // tslint:disable-next-line: lightweight-tokens
    @Optional() private _dialogRef: SbbDialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: SbbDialog
  ) {}

  ngOnInit() {
    if (!this._dialogRef) {
      // When this directive is included in a dialog via TemplateRef (rather than being
      // in a Component), the DialogRef isn't available via injection because embedded
      // views cannot be given a custom injector. Instead, we look up the DialogRef by
      // ID. This must occur in `onInit`, as the ID binding for the dialog container won't
      // be resolved at constructor time.
      this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs)!;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const proxiedChange = changes['_sbbDialogClose'] || changes['_sbbDialogCloseResult'];

    if (proxiedChange) {
      this.dialogResult = proxiedChange.currentValue;
    }
  }

  @HostListener('click', ['$event'])
  _onButtonClick(event: MouseEvent) {
    // Determinate the focus origin using the click event, because using the FocusMonitor will
    // result in incorrect origins. Most of the time, close buttons will be auto focused in the
    // dialog, and therefore clicking the button won't result in a focus change. This means that
    // the FocusMonitor won't detect any origin change, and will always output `program`.
    _closeDialogVia(
      this._dialogRef,
      event.screenX === 0 && event.screenY === 0 ? 'keyboard' : 'mouse',
      this.dialogResult
    );
  }
}

/**
 * Base class for dialog title.
 */
@Directive()
// tslint:disable-next-line: class-name naming-convention
export class _SbbDialogTitleBase implements OnInit {
  /** Unique id for the dialog title. If none is supplied, it will be auto-generated. */
  @Input() id: string = `sbb-dialog-title-${dialogElementUid++}`;

  /** Whether the close button is disabled for the dialog. */
  _closeEnabled: boolean = false;

  constructor(
    // The dialog title directive is always used in combination with a `SbbDialogRef`.
    // tslint:disable-next-line: lightweight-tokens
    @Optional() protected _dialogRef: SbbDialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: SbbDialog,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this._dialogRef) {
      // When this directive is included in a dialog via TemplateRef (rather than being
      // in a Component), the DialogRef isn't available via injection because embedded
      // views cannot be given a custom injector. Instead, we look up the DialogRef by
      // ID. This must occur in `onInit`, as the ID binding for the dialog container won't
      // be resolved at constructor time.
      this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs)!;
    }

    if (this._dialogRef) {
      Promise.resolve().then(() => {
        const container = this._dialogRef._containerInstance;

        if (!container) {
          return;
        }
        if (!container._config.disableClose) {
          this._closeEnabled = true;
          this._changeDetectorRef.markForCheck();
        }
        if (!container._ariaLabelledBy) {
          container._ariaLabelledBy = this.id;
        }
      });
    }
  }
}

/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
@Component({
  selector: 'sbb-dialog-title, [sbb-dialog-title], [sbbDialogTitle]',
  exportAs: 'sbbDialogTitle',
  template: `
    <ng-content></ng-content>
    <button
      *ngIf="_closeEnabled"
      sbb-dialog-close
      class="sbb-dialog-title-close-button sbb-button-reset-frameless"
    >
      <sbb-icon svgIcon="kom:cross-small"></sbb-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-dialog-title',
    '[id]': 'id',
  },
})
export class SbbDialogTitle extends _SbbDialogTitleBase {}

/**
 * Scrollable content container of a dialog.
 */
@Directive({
  selector: `[sbb-dialog-content], sbb-dialog-content, [sbbDialogContent]`,
  host: { class: 'sbb-dialog-content sbb-scrollbar' },
})
export class SbbDialogContent {}

/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
@Directive({
  selector: `[sbb-dialog-actions], sbb-dialog-actions, [sbbDialogActions]`,
  host: { class: 'sbb-dialog-actions' },
})
export class SbbDialogActions {}

/**
 * Finds the closest SbbDialogRef to an element by looking at the DOM.
 * @param element Element relative to which to look for a dialog.
 * @param openDialogs References to the currently-open dialogs.
 */
function getClosestDialog(element: ElementRef<HTMLElement>, openDialogs: SbbDialogRef<any>[]) {
  let parent: HTMLElement | null = element.nativeElement.parentElement;

  while (
    parent &&
    !parent.classList.contains('sbb-dialog-container') &&
    !parent.classList.contains('sbb-lightbox-container')
  ) {
    parent = parent.parentElement;
  }

  return parent ? openDialogs.find((dialog) => dialog.id === parent!.id) : null;
}
