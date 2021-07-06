import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SbbDialog } from '@sbb-esta/angular/dialog';

/**
 * @title Template Dialog
 * @order 30
 */
@Component({
  selector: 'sbb-template-dialog-example',
  templateUrl: 'template-dialog-example.html',
})
export class TemplateDialogExample {
  @ViewChild('sampleDialogTemplate', { static: true }) sampleDialogTemplate: TemplateRef<any>;

  constructor(public dialog: SbbDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(this.sampleDialogTemplate);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
