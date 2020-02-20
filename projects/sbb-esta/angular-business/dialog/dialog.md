The dialog can be used to seek confirmation as see below

```html
<div sbbDialog>
  <div sbbDialogHeader>
    <p>Hi {{ data.name }}</p>
  </div>
  <div sbbDialogContent>
    <div>
      What's your favorite animal?
      <sbb-field label="Animal" mode="long">
        <input type="text" [(ngModel)]="data.animal" cdkFocusInitial />
      </sbb-field>
    </div>
  </div>
  <div sbbDialogFooter>
    <button sbbButton [sbbDialogClose]="data.animal">
      Ok
    </button>
    <button sbbButton mode="secondary" (click)="noThanks()">
      No Thanks
    </button>
  </div>
</div>
```

### Sharing data with the Dialog component

A dialog is opened by calling the `open` method and if you want to share data with your dialog,
you can use the `data` option to pass information to the dialog component.

```ts
const dialogRef = this.dialog.openDialog(DialogShowcaseExampleContentComponent, {
  data: { name: this.name, animal: this.animal }
});
```

Components created via `Dialog` can use `DialogRef` to close the dialog in which they are
contained. To access data in your dialog component, you have to use the `DIALOG_DATA` injection
token. When closing, the data result value is provided. This result value is forwarded as the
result of the `afterClosed` promise.

```ts
@Component({
  selector: 'sbb-dialog-showcase-content-1',
  templateUrl: 'dialog-showcase-content-1.component.html'
})
export class DialogShowcaseExampleContentComponent {
  constructor(
    public dialogRef: DialogRef<DialogShowcaseExampleContentComponent>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
```

```ts
dialogRef.afterClosed().subscribe(result => {
  console.log('Dialog sharing data was closed');
  this.animal = result;
});
```

### Dialog with content loaded from Template

You can use `Dialog` to load content from a TemplateRef by calling `open` method and
passing it the template reference:

```ts
@Component({
  selector: 'sbb-dialog-showcase-example-3',
  templateUrl: 'dialog-showcase-content-3.component.html'
})
export class DialogShowcaseExample3Component {
  @ViewChild('sampleDialogTemplate', { static: true }) sampleDialogTemplate: TemplateRef<any>;
  constructor(public dialog: Dialog) {}

  openDialog() {
    const dialogRef = this.dialog.openDialog(this.sampleDialogTemplate);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
```

```html
<ng-template #sampleDialogTemplate>
  <div sbbDialog>
    <div sbbDialogHeader>
      <p>Terms and conditions</p>
    </div>
    <div sbbDialogContent>
      <div>
        <p>Lorem ipsum dolor sit amet...</p>
      </div>
    </div>
    <div sbbDialogFooter>
      <button sbbButton [sbbDialogClose]="true">
        Accept
      </button>
      <button sbbButton mode="secondary" sbbDialogClose>
        Cancel
      </button>
    </div>
  </div>
</ng-template>
```

- You can also use the disableClose property on `Dialog` to close the dialog manually and
  listening changes with `manualCloseAction` method of DialogRef istance:

```ts
@Component({
  selector: 'sbb-dialog-showcase-example-5',
  template: `
    <div class="sbbsc-block">
      <button sbbButton mode="secondary" (click)="openDialog()">
        Open with confirmation button in separate one
      </button>
    </div>
  `
})
export class DialogShowcaseExample5Component {
  constructor(public dialog: Dialog) {}
  openDialog() {
    const dialogRef = this.dialog.openDialog(DialogShowcaseExample5ContentComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log(`Dialog confirmed`);
    });
  }
}
```

```ts
export class DialogShowcaseExample5ContentComponent implements OnInit {
  constructor(
    private _dialogRef: DialogRef<DialogShowcaseExample5ContentComponent>,
    public dialog: Dialog
  ) {}
  ngOnInit() {
    this._dialogRef.manualCloseAction.subscribe(() => {
      this.dialog.openDialog(DialogShowcaseExample6ContentComponent);
    });
  }
}

export class DialogShowcaseExample6ContentComponent {
  constructor(
    private _dialogRef: DialogRef<DialogShowcaseExample5ContentComponent>,
    public dialog: Dialog
  ) {}
  closeThisDialog() {
    this._dialogRef.close();
  }
  closeAllDialog() {
    this.dialog.closeAll();
  }
}
```
