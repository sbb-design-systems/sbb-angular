import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  Optional,
  ViewEncapsulation,
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
  template: ` <ng-content select="button"></ng-content> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-dialog-footer',
    '[class.sbb-dialog-footer-align-start]': 'this.alignment === "left"',
    '[class.sbb-dialog-footer-align-center]': 'this.alignment === "center"',
    '[class.sbb-dialog-footer-align-end]': 'this.alignment === "right"',
  },
})
export class DialogFooterComponent implements OnInit {
  /** Types of alignment. */
  @Input() alignment: 'left' | 'center' | 'right' = 'right';

  /** @deprecated internal detail */
  dialogFooterClass = true;
  /** @deprecated internal detail */
  get alignmentStartClass() {
    return this.alignment === 'left';
  }
  /** @deprecated internal detail */
  get alignmentCenterClass() {
    return this.alignment === 'center';
  }
  /** @deprecated internal detail */
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

  // tslint:disable: member-ordering
  static ngAcceptInputType_alignment: 'left' | 'center' | 'right' | string | null | undefined;
  // tslint:enable: member-ordering
}
