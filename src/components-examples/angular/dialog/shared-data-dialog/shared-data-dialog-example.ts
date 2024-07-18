import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import {
  SbbDialog,
  SbbDialogModule,
  SbbDialogRef,
  SBB_DIALOG_DATA,
} from '@sbb-esta/angular/dialog';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

export interface DialogData {
  animal: string;
  name: string;
}

/**
 * @title Shared Data Dialog
 * @order 20
 */
@Component({
  selector: 'sbb-shared-data-dialog-example',
  templateUrl: 'shared-data-dialog-example.html',
  standalone: true,
  imports: [FormsModule, SbbButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedDataDialogExample {
  readonly dialog = inject(SbbDialog);
  readonly animal = signal('');
  readonly name = model('');

  openDialog(): void {
    const dialogRef = this.dialog.open(SharedDataDialogComponent, {
      data: { name: this.name(), animal: this.animal() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog sharing data was closed');
      if (result !== undefined) {
        this.animal.set(result);
      }
    });
  }
}

@Component({
  selector: 'sbb-shared-data-dialog',
  template: `
    <div sbbDialogTitle>Hi {{ data.name }}</div>
    <div sbbDialogContent>
      <div>
        What's your favorite animal?
        <sbb-form-field label="Animal">
          <input type="text" sbbInput [(ngModel)]="data.animal" cdkFocusInitial />
        </sbb-form-field>
      </div>
    </div>
    <div sbbDialogActions>
      <button sbb-button [sbbDialogClose]="data.animal" cdkFocusInitial>Ok</button>
      <button sbb-secondary-button (click)="noThanks()">No Thanks</button>
    </div>
  `,
  standalone: true,
  imports: [SbbDialogModule, SbbFormFieldModule, SbbInputModule, FormsModule, SbbButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedDataDialogComponent {
  readonly dialogRef = inject(SbbDialogRef<SharedDataDialogComponent>);
  readonly data = inject<DialogData>(SBB_DIALOG_DATA);

  noThanks(): void {
    this.dialogRef.close();
  }
}
