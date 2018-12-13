import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from 'sbb-angular';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-overview-example-dialog',
  template: `<h1 mat-dialog-title>Hi {{data.name}}</h1>
  <div mat-dialog-content>
    <p>What's your favorite animal?</p>
      <input [(ngModel)]="data.animal">
  </div>
  <div mat-dialog-actions>
    <button (click)="onNoClick()">No Thanks</button>
    <button [mat-dialog-close]="data.animal" cdkFocusInitial>Ok</button>
  </div>`
})
export class LightboxShowcaseExampleDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<LightboxShowcaseExampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'sbb-lightbox-showcase-example',
  templateUrl: './lightbox-showcase.component.html',
  styleUrls: ['./lightbox-showcase.component.scss']
})
export class LightboxShowcaseExampleComponent {

  animal: string;
  name: string;

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(LightboxShowcaseExampleDialogComponent, {
      width: '250px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

}

