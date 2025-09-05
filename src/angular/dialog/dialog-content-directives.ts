// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { _IdGenerator } from '@angular/cdk/a11y';
import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbDialog } from './dialog';
import { SbbDialogRef, _closeDialogVia } from './dialog-ref';

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
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected _dialogRef: SbbDialogRef<any> = inject<SbbDialogRef<any>>(SbbDialogRef, {
    optional: true,
  })!;
  protected _dialog: SbbDialog = inject(SbbDialog);

  /** Screenreader label for the button. */
  @Input('aria-label')
  ariaLabel: string = $localize`:Aria label to close a dialog@@sbbDialogCloseDialog:Close dialog`;

  /** Default to "button" to prevents accidental form submits. */
  @Input() type: 'submit' | 'button' | 'reset' = 'button';

  /** Dialog close input. */
  @Input('sbb-dialog-close') dialogResult: any;

  @Input('sbbDialogClose') _sbbDialogClose: any;

  /**
   * Callback which is called before closing.
   * If returning true, dialog can close.
   * If returning false, dialog cannot close.
   */
  _canCloseInterceptor: () => boolean = () => true;

  constructor(...args: unknown[]);
  constructor() {}

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
    if (!this._canCloseInterceptor()) {
      return;
    }
    // Determinate the focus origin using the click event, because using the FocusMonitor will
    // result in incorrect origins. Most of the time, close buttons will be auto focused in the
    // dialog, and therefore clicking the button won't result in a focus change. This means that
    // the FocusMonitor won't detect any origin change, and will always output `program`.
    _closeDialogVia(
      this._dialogRef,
      event.screenX === 0 && event.screenY === 0 ? 'keyboard' : 'mouse',
      this.dialogResult,
    );
  }
}

/**
 * Base class for dialog title.
 */
@Directive()
// tslint:disable-next-line: class-name naming-convention
export class _SbbDialogTitleBase implements OnInit, OnDestroy {
  protected _dialogRef: SbbDialogRef<any> = inject<SbbDialogRef<any>>(SbbDialogRef, {
    optional: true,
  })!;
  protected _dialog: SbbDialog = inject(SbbDialog);
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  /** Unique id for the dialog title. If none is supplied, it will be auto-generated. */
  @Input() id = inject(_IdGenerator).getId('sbb-dialog-title-');

  /** Arial label for the close button. */
  @Input()
  closeAriaLabel: string =
    $localize`:Aria label to close a dialog@@sbbDialogCloseDialog:Close dialog`;

  /** Whether the close button is enabled for the dialog. */
  _closeEnabled: boolean = true;

  constructor(...args: unknown[]);
  constructor() {}

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
        if (container._config.disableClose) {
          this._closeEnabled = false;
          this._changeDetectorRef.markForCheck();
        }
        // Note: we null check the queue, because there are some internal
        // tests that are mocking out `SbbDialogRef` incorrectly.
        this._dialogRef._containerInstance?._addAriaLabelledBy?.(this.id);
      });
    }
  }

  ngOnDestroy() {
    // Note: we null check because there are some internal
    // tests that are mocking out `MatDialogRef` incorrectly.
    const instance = this._dialogRef?._containerInstance;

    if (instance) {
      Promise.resolve().then(() => {
        instance._removeAriaLabelledBy?.(this.id);
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
    @if (_closeEnabled) {
      <button
        [sbb-dialog-close]="undefined"
        class="sbb-dialog-title-close-button sbb-button-reset-frameless"
        [aria-label]="closeAriaLabel"
      >
        <sbb-icon svgIcon="cross-small"></sbb-icon>
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-dialog-title',
    '[id]': 'id',
  },
  imports: [SbbDialogClose, SbbIconModule],
})
export class SbbDialogTitle extends _SbbDialogTitleBase {}

/**
 * Scrollable content container of a dialog.
 */
@Directive({
  selector: `[sbb-dialog-content], sbb-dialog-content, [sbbDialogContent]`,
  host: { class: 'sbb-dialog-content sbb-scrollbar' },
  hostDirectives: [CdkScrollable],
})
export class SbbDialogContent {}

/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
@Directive({
  selector: `[sbb-dialog-actions], sbb-dialog-actions, [sbbDialogActions]`,
  host: {
    class: 'sbb-dialog-actions',
    '[class.sbb-dialog-actions-align-start]': 'align === "start"',
    '[class.sbb-dialog-actions-align-center]': 'align === "center"',
    '[class.sbb-dialog-actions-align-end]': 'align === "end"',
  },
})
export class SbbDialogActions {
  /**
   * Horizontal alignment of action buttons.
   */
  @Input() align?: 'start' | 'center' | 'end' = 'end';
}

// TODO(crisbeto): this utility shouldn't be necessary anymore, because the dialog ref is provided
// both to component and template dialogs through DI. We need to keep it around, because there are
// some internal wrappers around `SbbDialog` that happened to work by accident, because we had this
// fallback logic in place.
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
