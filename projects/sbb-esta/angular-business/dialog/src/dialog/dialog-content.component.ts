import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

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
