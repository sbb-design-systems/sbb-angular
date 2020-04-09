import { Component, Inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Dialog, DialogRef, DIALOG_DATA } from '@sbb-esta/angular-business/dialog';

export interface DialogData {
  animal: string;
  name: string;
}

/**
 * Dialog sharing data
 */
@Component({
  selector: 'sbb-dialog-example-content-1',
  templateUrl: 'dialog-example-content-1.component.html'
})
export class DialogExampleExampleContentComponent {
  constructor(
    public dialogRef: DialogRef<DialogExampleExampleContentComponent>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}

  noThanks(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'sbb-dialog-example-example',
  template: `
    <ol>
      <li>
        <input type="text" [(ngModel)]="name" placeholder="What's your name?" />
      </li>
      <li>
        <button sbbButton mode="secondary" (click)="openDialog()">
          Pick one
        </button>
      </li>
      <li *ngIf="animal">
        You chose: <i>{{ animal }}</i>
      </li>
    </ol>
  `
})
export class DialogExampleExampleComponent {
  animal: string;
  name: string;

  constructor(public dialog: Dialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.openDialog(DialogExampleExampleContentComponent, {
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog sharing data was closed');
      this.animal = result;
    });
  }
}

/**
 * Dialog with content loaded from component, footer button bar
 */
@Component({
  selector: 'sbb-dialog-example-content-2',
  templateUrl: 'dialog-example-content-2.component.html'
})
export class DialogExampleExample2ContentComponent {}

/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'sbb-dialog-example-example-2',
  template: `
    <div class="sbbsc-block">
      <button sbbButton mode="secondary" (click)="openDialog()">
        Open Dialog from Component
      </button>
    </div>
  `
})
export class DialogExampleExample2Component {
  constructor(public dialog: Dialog) {}

  openDialog() {
    const dialogRef = this.dialog.openDialog(DialogExampleExample2ContentComponent, {
      width: '40rem',
      height: '40rem',
      position: { top: '10px' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

/**
 * Dialog with content loaded from Template
 */
@Component({
  selector: 'sbb-dialog-example-example-3',
  templateUrl: 'dialog-example-content-3.component.html'
})
export class DialogExampleExample3Component {
  @ViewChild('sampleDialogTemplate', { static: true }) sampleDialogTemplate: TemplateRef<any>;

  constructor(public dialog: Dialog) {}

  openDialog() {
    const dialogRef = this.dialog.openDialog(this.sampleDialogTemplate);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'sbb-dialog-example',
  templateUrl: 'dialog-example.component.html',
  styleUrls: ['dialog-example.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogExampleComponent {}
