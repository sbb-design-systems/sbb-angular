import { Directive, ElementRef, HostBinding, Input, OnInit, Optional } from '@angular/core';

import { DialogHelperService } from './dialog-helper.service';
import { DialogRef } from './dialog-ref';
import { Dialog } from './dialog.service';

/** Counter used to generate unique IDs for dialog elements. */
let dialogElementUid = 0;

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
    private _dialog: Dialog,
    private _dialogHelperService: DialogHelperService
  ) {}

  ngOnInit() {
    if (!this._dialogRef) {
      this._dialogRef = this._dialogHelperService.getClosestDialog(
        this._elementRef,
        this._dialog.openDialogs
      );
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
