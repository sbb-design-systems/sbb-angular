import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Optional
} from '@angular/core';

import { DialogRef } from './dialog-ref';
import { Dialog } from './dialog.service';

/** Counter used to generate unique IDs for dialog elements. */
let dialogElementUid = 0;

/**
 * Button that will close the current dialog.
 */
@Directive({
  selector: `button[sbbDialogClose]`,
  exportAs: 'sbbDialogClose'
})
export class DialogCloseDirective implements OnInit {
  /** Screenreader label for the button. */
  @HostBinding('attr.aria-label')
  ariaLabel = 'Close dialog';

  /**  Prevents accidental form submits. **/
  @HostBinding('attr.type')
  btnType = 'button';

  /** dialog close input **/
  // tslint:disable-next-line:no-input-rename
  @Input('sbbDialogClose')
  dialogResult: any;

  constructor(
    /** Reference of dialog. */
    @Optional() public dialogRef: DialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: Dialog
  ) {}

  ngOnInit() {
    if (!this.dialogRef) {
      // When this directive is included in a dialog via TemplateRef (rather than being
      // in a Component), the dialogRef isn't available via injection because embedded
      // views cannot be given a custom injector. Instead, we look up the dialogRef by
      // ID. This must occur in `onInit`, as the ID binding for the dialog container won't
      // be resolved at constructor time.
      this.dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
    }
  }

  @HostListener('click')
  onCloseClick() {
    this.dialogRef.close(this.dialogResult);
  }
}

/**
 * Dialog wrapper element. Contains the dialog's header, content and footer.
 */
@Component({
  selector: 'sbb-dialog, [sbbDialog]',
  template: `
    <div class="sbb-dialog">
      <ng-content select="[sbbDialogHeader]"></ng-content>
      <ng-content select="[sbbDialogContent]"></ng-content>
      <ng-content select="[sbbDialogFooter]"></ng-content>
    </div>
  `,
  exportAs: 'sbbDialog',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent {}

/**
 * Header of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
@Component({
  selector: 'sbb-dialog-header, [sbbDialogHeader]',
  template: `
    <ng-content></ng-content>
    <button type="button" sbbDialogClose *ngIf="!isCloseDisabled" class="sbb-dialog-close-btn">
      <sbb-icon-cross></sbb-icon-cross>
    </button>
    <button
      *ngIf="isCloseDisabled"
      type="button"
      (click)="emitManualCloseAction()"
      class="sbb-dialog-close-btn"
    >
      <sbb-icon-cross></sbb-icon-cross>
    </button>
  `,
  exportAs: 'sbbDialogHeader',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogHeaderComponent implements OnInit {
  /** Disables dialog header when dialog is closed.  */
  isCloseDisabled: boolean;
  /** Class attribute on dialog header. */
  @HostBinding('class.sbb-dialog-header')
  dialogHeaderClass = true;

  constructor(
    @Optional() private _dialogRef: DialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: Dialog,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this._dialogRef) {
      this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
    }

    if (this._dialogRef) {
      Promise.resolve().then(() => {
        const container = this._dialogRef.containerInstance;

        if (container) {
          container.hasHeader = true;
          this.isCloseDisabled = container.config.disableClose;
          this._changeDetectorRef.markForCheck();
        }
      });
    }
  }

  emitManualCloseAction() {
    if (this._dialogRef) {
      this._dialogRef.manualCloseAction.next(null);
    }
  }
}

@Directive({
  selector: `[sbbDialogTitle]`
})
export class DialogTitleDirective implements OnInit {
  /** Identifier of dialog title. */
  @Input()
  @HostBinding('attr.id')
  id = `sbb-dialog-title-${dialogElementUid++}`;
  /** Class attribute for dialog title. */
  @HostBinding('class.sbb-dialog-title')
  dialogTitleClass = true;

  constructor(
    @Optional() private _dialogRef: DialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: Dialog
  ) {}

  ngOnInit() {
    if (!this._dialogRef) {
      this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
    }

    if (this._dialogRef) {
      Promise.resolve().then(() => {
        const container = this._dialogRef.containerInstance;

        if (container && !container.ariaLabelledBy) {
          container.ariaLabelledBy = this.id;
        }
      });
    }
  }
}

/**
 * Scrollable content container of a dialog.
 */
@Component({
  selector: `sbb-dialog-content, [sbbDialogContent]`,
  template: `
    <perfect-scrollbar>
      <ng-content></ng-content>
    </perfect-scrollbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogContentComponent {
  /** Class attribute for dialog content */
  @HostBinding('class.sbb-dialog-content')
  dialogContentClass = true;
}

/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
@Component({
  selector: `sbb-dialog-footer, [sbbDialogFooter]`,
  template: `
    <perfect-scrollbar>
      <ng-content select="button"></ng-content>
    </perfect-scrollbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogFooterComponent implements OnInit {
  /** Class attribute for the footer.  */
  @HostBinding('class.sbb-dialog-footer')
  dialogFooterClass = true;
  /** Types of alignment. */
  @Input() alignment: 'left' | 'center' | 'right' = 'right';

  /** Alignment to left position.  */
  @HostBinding('class.sbb-dialog-footer-align-start')
  get alignmentStartClass() {
    return this.alignment === 'left';
  }

  /** Alignment to center position.  */
  @HostBinding('class.sbb-dialog-footer-align-center')
  get alignmentCenterClass() {
    return this.alignment === 'center';
  }

  /** Alignment to right position.  */
  @HostBinding('class.sbb-dialog-footer-align-end')
  get alignmentEndClass() {
    return this.alignment === 'right';
  }

  constructor(
    @Optional() private _dialogRef: DialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: Dialog
  ) {}

  ngOnInit() {
    if (!this._dialogRef) {
      this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
    }

    if (this._dialogRef) {
      Promise.resolve().then(() => {
        const container = this._dialogRef.containerInstance;

        if (container) {
          container.hasFooter = true;
        }
      });
    }
  }
}

/**
 * Finds the closest DialogRef to an element by looking at the DOM.
 * @param element Element relative to which to look for a dialog.
 * @param openDialogs References to the currently-open dialogs.
 */
function getClosestDialog(element: ElementRef<HTMLElement>, openDialogs: DialogRef<any>[]) {
  let parent: HTMLElement | null = element.nativeElement.parentElement;

  while (parent && !parent.classList.contains('sbb-dialog-container')) {
    parent = parent.parentElement;
  }

  return parent ? openDialogs.find(dialog => dialog.id === parent.id) : null;
}
