import { ChangeDetectionStrategy, Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbDialog, SbbDialogModule } from '@sbb-esta/angular/dialog';

/**
 * @title Template Dialog
 * @order 30
 */
@Component({
  selector: 'sbb-template-dialog-example',
  templateUrl: 'template-dialog-example.html',
  imports: [SbbButtonModule, SbbDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDialogExample {
  @ViewChild('sampleDialogTemplate', { static: true }) sampleDialogTemplate: TemplateRef<any>;
  readonly dialog = inject(SbbDialog);

  openDialog() {
    const dialogRef = this.dialog.open(this.sampleDialogTemplate);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
