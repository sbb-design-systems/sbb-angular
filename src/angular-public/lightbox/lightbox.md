The lightbox can be used to open modal dialogs as seen below

```html
<header sbbLightboxHeader></header>
<div sbbLightboxContent>
  <div class="sbbsc-lightbox-example-1-content">
    <h1 sbbLightboxTitle>Hi {{data.name}}</h1>
    <p>What's your favorite animal?</p>
    <sbb-form-field>
      <input type="text" [(ngModel)]="data.animal" cdkFocusInitial />
    </sbb-form-field>
    <div class="sbbsc-block">
      <button type="button" sbbButton mode="ghost" (click)="noThanks()" style="margin-right: 1em;">
        No Thanks
      </button>
      <button type="button" sbbButton [sbbLightboxClose]="data.animal" cdkFocusInitial>Ok</button>
    </div>
  </div>
</div>
```

### Sharing data with the Lightbox component

A dialog is opened by calling the `open` method and if you want to share data with your dialog,
you can use the `data` option to pass information to the dialog component.

```ts
const lightboxRef = this.lightbox.open(LightboxShowcaseExampleContentComponent, {
  data: { name: this.name, animal: this.animal },
});
```

Components created via `Lightbox` can use `LightboxRef` to close the dialog in which they are
contained. To access data in your dialog component, you have to use the `LightboxData` injection
token. When closing, the data result value is provided. This result value is forwarded as the
result of the `afterClosed` promise.

```ts
@Component({
  selector: 'sbb-lightbox-showcase-content-1',
  templateUrl: 'lightbox-showcase-content-1.component.html',
})
export class LightboxShowcaseExampleContentComponent {
  constructor(
    public lightboxRef: LightboxRef<LightboxShowcaseExampleContentComponent>,
    @Inject(LIGHTBOX_DATA) public data: LightboxData
  ) {}

  noThanks(): void {
    this.lightboxRef.close();
  }
}
```

```ts
lightboxRef.afterClosed().subscribe((result) => {
  console.log('Lightbox sharing data was closed');
  this.animal = result;
});
```

<h2>Lightbox with content loaded from Template</h2>

You can use `Lightbox` to load content from a TemplateRef by calling `open` method and
passing it the template reference:

```ts
@Component({
  selector: 'sbb-lightbox-showcase-example-3',
  templateUrl: 'lightbox-showcase-content-3.component.html',
})
export class LightboxShowcaseExample3Component {
  @ViewChild('sampleLightboxTemplate') sampleLightboxTemplate: TemplateRef<any>;
  constructor(public lightbox: Lightbox) {}

  openDialog() {
    const lightboxRef = this.lightbox.open(this.sampleLightboxTemplate);

    lightboxRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
```

```html
<ng-template #sampleLightboxTemplate>
  <sbb-lightbox-header> Sample text </sbb-lightbox-header>
  <sbb-lightbox-content>
    <h2 sbbLightboxTitle>Install Angular</h2>
    <h3>Develop across all platforms</h3>
    <p>
      Learn one way to build applications with Angular and reuse your code and abilities to build
      apps for any deployment target. For web, mobile web, native mobile and native desktop.
    </p>
    <h3>What is Angular?</h3>
    <p>
      Angular is a platform that makes it easy to build applications with the web. Angular combines
      declarative templates, dependency injection, end to end tooling, and integrated best practices
      to solve development challenges. Angular empowers developers to build applications that live
      on the web, mobile, or the desktop
    </p>
  </sbb-lightbox-content>
  <sbb-lightbox-footer alignment="right">
    <button type="button" sbbButton mode="ghost" sbbLightboxClose>Cancel</button>
    <button type="button" sbbButton [sbbLightboxClose]="true" cdkFocusInitial>Accept</button>
  </sbb-lightbox-footer>
</ng-template>
```

- You can also use the disableClose property on `Lightbox` to close the dialog manually and
  listening changes with `manualCloseAction` method of LightboxRef istance:

```ts
@Component({
  selector: 'sbb-lightbox-showcase-example-5',
  template: `
    <div class="sbbsc-block">
      <button type="button" sbbButton mode="secondary" (click)="openDialog()">
        Open with confirmation button in separate one
      </button>
    </div>
  `,
})
export class LightboxShowcaseExample5Component {
  constructor(public lightbox: Lightbox) {}
  openDialog() {
    const lightboxRef = this.lightbox.open(LightboxShowcaseExample5ContentComponent, {
      disableClose: true,
    });
    lightboxRef.afterClosed().subscribe(() => {
      console.log(`Lightbox confirmed`);
    });
  }
}
```

```ts
export class LightboxShowcaseExample5ContentComponent implements OnInit {
  constructor(
    private _lightBoxRef: LightboxRef<LightboxShowcaseExample5ContentComponent>,
    public lightbox: Lightbox
  ) {}
  ngOnInit() {
    this._lightBoxRef.manualCloseAction.subscribe(() => {
      this.lightbox.open(LightboxShowcaseExample6ContentComponent);
    });
  }
}

export class LightboxShowcaseExample6ContentComponent {
  constructor(
    private _lightBoxRef: LightboxRef<LightboxShowcaseExample5ContentComponent>,
    public lightbox: Lightbox
  ) {}
  closeThisLightbox() {
    this._lightBoxRef.close();
  }
  closeAllLightbox() {
    this.lightbox.closeAll();
  }
}
```
