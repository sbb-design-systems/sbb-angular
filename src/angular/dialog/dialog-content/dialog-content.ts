import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/** Scrollable content container of a dialog. */
@Component({
  selector: `sbb-dialog-content, [sbbDialogContent]`,
  styleUrls: ['./dialog-content.css'],
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-dialog-content sbb-scrollbar',
  },
})
export class SbbDialogContent {}
