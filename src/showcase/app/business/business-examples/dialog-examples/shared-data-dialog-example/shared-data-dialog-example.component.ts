import { Component, Inject } from '@angular/core';
import { Dialog, DialogRef, DIALOG_DATA } from '@sbb-esta/angular-business/dialog';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'sbb-shared-data-dialog-example',
  templateUrl: 'shared-data-dialog-example.component.html',
})
export class SharedDataDialogExampleComponent {
  animal: string;
  name: string;

  constructor(public dialog: Dialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.openDialog(SharedDataDialogComponent, {
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog sharing data was closed');
      this.animal = result;
    });
  }
}

@Component({
  selector: 'sbb-shared-data-dialog',
  template: `
    <div sbbDialogHeader>Hi {{ data.name }}</div>
    <div sbbDialogContent>
      <div>
        What's your favorite animal?
        <sbb-field label="Animal" mode="long">
          <input type="text" sbbInput [(ngModel)]="data.animal" cdkFocusInitial />
        </sbb-field>
      </div>
    </div>
    <div sbbDialogFooter>
      <button sbbButton [sbbDialogClose]="data.animal" cdkFocusInitial>
        Ok
      </button>
      <button sbbButton mode="secondary" (click)="noThanks()">
        No Thanks
      </button>
    </div>
  `,
})
export class SharedDataDialogComponent {
  constructor(
    public dialogRef: DialogRef<SharedDataDialogComponent>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}

  noThanks(): void {
    this.dialogRef.close();
  }
}
