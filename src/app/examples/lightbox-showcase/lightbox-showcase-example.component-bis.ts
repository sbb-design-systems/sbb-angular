import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from 'sbb-angular';

/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-content-example-bis',
  template: '<button (click)="openDialog()">Open dialog</button>'
})
export class LightboxShowcaseExampleBisComponent {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(LightboxShowcaseExampleDialogBisComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-content-example-dialog-bis',
  templateUrl: 'lightbox-showcase.component-bis.html',
})
// tslint:disable-next-line:component-class-suffix
export class LightboxShowcaseExampleDialogBisComponent {}
