import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Optional,
} from '@angular/core';

import { DialogHelperService } from '../dialog/dialog-helper.service';
import { DialogRef } from '../dialog/dialog-ref';
import { Dialog } from '../dialog/dialog.service';

/**
 * Header of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
@Component({
  selector: 'sbb-dialog-header, [sbbDialogHeader]',
  styleUrls: ['dialog-header.component.css'],
  template: `
    <ng-content></ng-content>
    <button type="button" sbbDialogClose *ngIf="!isCloseDisabled" class="sbb-dialog-close-btn">
      <sbb-icon svgIcon="kom:cross-small"></sbb-icon>
    </button>
  `,
  exportAs: 'sbbDialogHeader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-dialog-header',
  },
})
export class DialogHeaderComponent implements OnInit {
  /** Disables dialog header when dialog is closed.  */
  isCloseDisabled: boolean;
  /** @deprecated internal detail */
  dialogHeaderClass = true;

  constructor(
    @Optional() private _dialogRef: DialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: Dialog,
    private _changeDetectorRef: ChangeDetectorRef,
    private _dialogHelperService: DialogHelperService
  ) {}

  ngOnInit() {
    if (!this._dialogRef) {
      this._dialogRef = this._dialogHelperService.getClosestDialog(
        this._elementRef,
        this._dialog.openDialogs
      )!;
    }

    if (this._dialogRef) {
      Promise.resolve().then(() => {
        const container = this._dialogRef.containerInstance;

        if (container) {
          container.hasHeader = true;
          this.isCloseDisabled = !!container.config.disableClose;
          this._changeDetectorRef.markForCheck();
        }
      });
    }
  }

  /**
   * @deprecated Not available for dialogs.
   */
  emitManualCloseAction() {}
}
