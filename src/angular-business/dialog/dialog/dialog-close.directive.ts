import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Optional,
} from '@angular/core';

import { DialogHelperService } from './dialog-helper.service';
import { DialogRef } from './dialog-ref';
import { Dialog } from './dialog.service';

/**
 * Button that will close the current dialog.
 */
@Directive({
  selector: `button[sbbDialogClose]`,
  exportAs: 'sbbDialogClose',
  host: {
    '[attr.aria-label]': 'ariaLabel || null',
    '[attr.type]': 'type',
  },
})
export class DialogCloseDirective implements OnInit {
  /** Screenreader label for the button. */
  @Input('aria-label') ariaLabel: string = 'Close dialog';

  /** Default to "button" to prevents accidental form submits. */
  @Input() type: 'submit' | 'button' | 'reset' = 'button';

  /** dialog close input **/
  @Input('sbbDialogClose') dialogResult: any;

  constructor(
    @Optional() public dialogRef: DialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: Dialog,
    private _dialogHelperService: DialogHelperService
  ) {}

  ngOnInit() {
    if (!this.dialogRef) {
      // When this directive is included in a dialog via TemplateRef (rather than being
      // in a Component), the dialogRef isn't available via injection because embedded
      // views cannot be given a custom injector. Instead, we look up the dialogRef by
      // ID. This must occur in `onInit`, as the ID binding for the dialog container won't
      // be resolved at constructor time.
      this.dialogRef = this._dialogHelperService.getClosestDialog(
        this._elementRef,
        this._dialog.openDialogs
      )!;
    }
  }

  @HostListener('click')
  onCloseClick() {
    this.dialogRef.close(this.dialogResult);
  }
}
