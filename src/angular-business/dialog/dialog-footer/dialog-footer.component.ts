import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Optional,
  ViewEncapsulation
} from '@angular/core';

import { DialogHelperService } from '../dialog/dialog-helper.service';
import { DialogRef } from '../dialog/dialog-ref';
import { Dialog } from '../dialog/dialog.service';

/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
@Component({
  selector: `sbb-dialog-footer, [sbbDialogFooter]`,
  styleUrls: ['./dialog-footer.component.css'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content select="button"></ng-content>
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
    private _dialog: Dialog,
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
          container.hasFooter = true;
        }
      });
    }
  }
}
