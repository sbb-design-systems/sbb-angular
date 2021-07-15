import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SbbLightbox, SbbLightboxRef, SBB_LIGHTBOX_DATA } from '@sbb-esta/angular-public/lightbox';

export interface LightboxData {
  animal: string;
  name: string;
}

/** Lightbox sharing data */
@Component({
  selector: 'sbb-lightbox-example-content-1',
  templateUrl: 'lightbox-example-content-1.component.html',
})
export class LightboxExampleExampleContentComponent {
  constructor(
    public lightboxRef: SbbLightboxRef<LightboxExampleExampleContentComponent>,
    @Inject(SBB_LIGHTBOX_DATA) public data: LightboxData
  ) {}

  noThanks(): void {
    this.lightboxRef.close();
  }
}

@Component({
  selector: 'sbb-lightbox-example-example',
  template: `
    <ol>
      <li>
        <input type="text" [(ngModel)]="name" placeholder="What's your name?" />
      </li>
      <li>
        <button sbbButton mode="secondary" (click)="open()">Pick one</button>
      </li>
      <li *ngIf="animal">
        You chose: <i>{{ animal }}</i>
      </li>
    </ol>
  `,
})
export class LightboxExampleExampleComponent {
  animal: string;
  name: string;

  constructor(public lightbox: SbbLightbox) {}

  open(): void {
    const lightboxRef = this.lightbox.open(LightboxExampleExampleContentComponent, {
      data: { name: this.name, animal: this.animal },
    });

    lightboxRef.afterClosed().subscribe((result) => {
      console.log('Lightbox sharing data was closed');
      this.animal = result;
    });
  }
}

/** Lightbox with content loaded from component, footer button bar */
@Component({
  selector: 'sbb-lightbox-example-content-2',
  templateUrl: 'lightbox-example-content-2.component.html',
})
export class LightboxExampleExample2ContentComponent {
  alignment = 'center';
}

/** @title Dialog with header, scrollable content and actions */
@Component({
  selector: 'sbb-lightbox-example-example-2',
  template: `
    <div class="sbbsc-block">
      <button sbbButton mode="secondary" (click)="openDialog()">
        Open Lightbox from Component
      </button>
    </div>
  `,
})
export class LightboxExampleExample2Component {
  constructor(public lightbox: SbbLightbox) {}

  openDialog() {
    const lightboxRef = this.lightbox.open(LightboxExampleExample2ContentComponent);

    lightboxRef.afterClosed().subscribe((result) => {
      console.log(`Lightbox result: ${result}`);
    });
  }
}

/** Lightbox with content loaded from Template */
@Component({
  selector: 'sbb-lightbox-example-example-3',
  templateUrl: 'lightbox-example-content-3.component.html',
})
export class LightboxExampleExample3Component {
  @ViewChild('sampleLightboxTemplate', { static: true }) sampleLightboxTemplate: TemplateRef<any>;
  constructor(public lightbox: SbbLightbox) {}

  openDialog() {
    const lightboxRef = this.lightbox.open(this.sampleLightboxTemplate);

    lightboxRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

/**
 * Lightbox Alert with confirmation button
 * all into one Lightbox using manualCloseAction Observable
 */
@Component({
  selector: 'sbb-lightbox-example-content-4',
  templateUrl: 'lightbox-example-content-4.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightboxExampleExample4ContentComponent implements OnInit {
  confirmPanel = false;

  constructor(
    private _lightBoxRef: SbbLightboxRef<LightboxExampleExample4ContentComponent>,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._lightBoxRef.manualCloseAction.subscribe(() => {
      this.confirmPanel = true;
      this._changeDetectorRef.markForCheck();
    });
  }
}

@Component({
  selector: 'sbb-lightbox-example-example-4',
  template: `
    <div class="sbbsc-block">
      <button sbbButton mode="secondary" (click)="openDialog()">
        Open with confirmation button in one Lightbox
      </button>
    </div>
  `,
})
export class LightboxExampleExample4Component {
  constructor(public lightbox: SbbLightbox) {}

  openDialog() {
    const lightboxRef = this.lightbox.open(LightboxExampleExample4ContentComponent, {
      disableClose: true,
    });

    lightboxRef.afterClosed().subscribe((result) => {
      console.log(`Lightbox ${result}`);
    });
  }
}

/**
 * Lightbox Alert with confirmation button
 * opening in a new extra Lightbox
 */
@Component({
  selector: 'sbb-lightbox-example-content-6',
  template: `
    <header sbbLightboxHeader></header>
    <div class="sbbsc-lb-disableclose-c-2">
      <h3>
        Sind Sie sicher, dass Sie dieses Fenster schliessen möchten? Ihre Eingaben werden dadurch
        verworfen.
      </h3>
      <button sbbButton mode="ghost" (click)="closeThisLightbox()">Eingaben überprüfen</button>
      <button sbbButton (click)="closeAllLightbox()">Fenster schliessen</button>
    </div>
  `,
})
export class LightboxExampleExample6ContentComponent {
  constructor(
    private _lightBoxRef: SbbLightboxRef<LightboxExampleExample5ContentComponent>,
    public lightbox: SbbLightbox
  ) {}

  closeThisLightbox() {
    this._lightBoxRef.close();
  }

  closeAllLightbox() {
    this.lightbox.closeAll();
  }
}

@Component({
  selector: 'sbb-lightbox-example-content-5',
  template: `
    <header sbbLightboxHeader></header>
    <div class="sbbsc-lb-disableclose-c-1">
      <h3 sbbLightboxTitle>
        In order to close this lightbox you have to confirm in the confirm panel which is going to
        appear when trying to close this lightbox
      </h3>
    </div>
  `,
})
export class LightboxExampleExample5ContentComponent implements OnInit {
  constructor(
    private _lightBoxRef: SbbLightboxRef<LightboxExampleExample5ContentComponent>,
    public lightbox: SbbLightbox
  ) {}

  ngOnInit() {
    this._lightBoxRef.manualCloseAction.subscribe(() => {
      this.lightbox.open(LightboxExampleExample6ContentComponent);
    });
  }
}

/** @title Dialog with header, scrollable content and actions */
@Component({
  selector: 'sbb-lightbox-example-example-5',
  template: `
    <div class="sbbsc-block">
      <button sbbButton mode="secondary" (click)="openDialog()">
        Open with confirmation button in separate one
      </button>
    </div>
  `,
})
export class LightboxExampleExample5Component {
  constructor(public lightbox: SbbLightbox) {}

  openDialog() {
    const lightboxRef = this.lightbox.open(LightboxExampleExample5ContentComponent, {
      disableClose: true,
    });

    lightboxRef.afterClosed().subscribe(() => {
      console.log(`Lightbox confirmed`);
    });
  }
}

@Component({
  selector: 'sbb-lightbox-example',
  templateUrl: 'lightbox-example.component.html',
  styleUrls: ['lightbox-example.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LightboxExampleComponent {}
