import { ChangeDetectionStrategy, Component } from '@angular/core';

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
