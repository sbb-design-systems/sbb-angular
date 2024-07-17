import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbDialog, SbbDialogModule } from '@sbb-esta/angular/dialog';

/**
 * @title Dialog Animations
 * @order 40
 */
@Component({
  selector: 'sbb-dialog-animations-example',
  styleUrls: ['dialog-animations-example.css'],
  templateUrl: 'dialog-animations-example.html',
  standalone: true,
  imports: [SbbButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationsExample {
  readonly dialog = inject(SbbDialog);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}

@Component({
  selector: 'sbb-dialog-animations-example-dialog',
  template: `
    <div sbbDialogTitle>Delete file</div>
    <div sbbDialogContent>Would you like to delete train.jpeg?</div>
    <div sbbDialogActions>
      <button sbb-button sbbDialogClose>Ok</button>
      <button sbb-secondary-button sbbDialogClose>No</button>
    </div>
  `,
  standalone: true,
  imports: [SbbDialogModule, SbbButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationsExampleDialog {}
