import { ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation } from '@angular/core';

/**
 * Scrollable content container of a dialog.
 */
@Component({
  selector: `sbb-dialog-content, [sbbDialogContent]`,
  styleUrls: ['./dialog-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogContentComponent {
  /** Class attribute for dialog content */
  @HostBinding('class.sbb-dialog-content')
  @HostBinding('class.sbb-scrollbar')
  dialogContentClass = true;
}
