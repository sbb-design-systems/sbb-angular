import { Component } from '@angular/core';
import { SbbDialog } from '@sbb-esta/angular/dialog';

/**
 * @title Dialog Animations
 * @order 40
 */
@Component({
  selector: 'sbb-dialog-animations-example',
  styleUrls: ['dialog-animations-example.css'],
  templateUrl: 'dialog-animations-example.html',
})
export class DialogAnimationsExample {
  constructor(public dialog: SbbDialog) {}

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
})
export class DialogAnimationsExampleDialog {}
