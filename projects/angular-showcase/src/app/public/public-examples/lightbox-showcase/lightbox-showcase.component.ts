import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Lightbox, LIGHTBOX_DATA, LightboxRef } from '@sbb-esta/angular-public/lightbox';

export interface LightboxData {
  animal: string;
  name: string;
}

/**
 * Lighbox sharing data
 */
@Component({
  selector: 'sbb-lightbox-showcase-content-1',
  templateUrl: 'lightbox-showcase-content-1.component.html'
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

@Component({
  selector: 'sbb-lightbox-showcase-example',
  template: `
    <ol>
      <li>
        <input type="text" [(ngModel)]="name" placeholder="What's your name?" />
      </li>
      <li>
        <button sbbButton mode="secondary" (click)="openLightbox()">
          Pick one
        </button>
      </li>
      <li *ngIf="animal">
        You chose: <i>{{ animal }}</i>
      </li>
    </ol>
  `
})
export class LightboxShowcaseExampleComponent {
  animal: string;
  name: string;

  constructor(public lightbox: Lightbox) {}

  openLightbox(): void {
    const lightboxRef = this.lightbox.openLightbox(LightboxShowcaseExampleContentComponent, {
      data: { name: this.name, animal: this.animal }
    });

    lightboxRef.afterClosed().subscribe(result => {
      console.log('Lighbox sharing data was closed');
      this.animal = result;
    });
  }
}

/**
 * Lighbox with content loaded from component, footer button bar
 */
@Component({
  selector: 'sbb-lightbox-showcase-content-2',
  templateUrl: 'lightbox-showcase-content-2.component.html'
})
export class LightboxShowcaseExample2ContentComponent {
  alignment = 'center';
}

/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'sbb-lightbox-showcase-example-2',
  template: `
    <div class="sbbsc-block">
      <button sbbButton mode="secondary" (click)="openDialog()">
        Open Lightbox from Component
      </button>
    </div>
  `
})
export class LightboxShowcaseExample2Component {
  constructor(public lightbox: Lightbox) {}

  openDialog() {
    const lightboxRef = this.lightbox.openLightbox(LightboxShowcaseExample2ContentComponent);

    lightboxRef.afterClosed().subscribe(result => {
      console.log(`Lightbox result: ${result}`);
    });
  }
}

/**
 * Lighbox with content loaded from Template
 */
@Component({
  selector: 'sbb-lightbox-showcase-example-3',
  templateUrl: 'lightbox-showcase-content-3.component.html'
})
export class LightboxShowcaseExample3Component {
  @ViewChild('sampleLightboxTemplate', { static: true }) sampleLightboxTemplate: TemplateRef<any>;
  constructor(public lightbox: Lightbox) {}

  openDialog() {
    const lightboxRef = this.lightbox.openLightbox(this.sampleLightboxTemplate);

    lightboxRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

/**
 * Lighbox Alert with confirmation button
 * all into one Lightbox using manualCloseAction Observable
 */
@Component({
  selector: 'sbb-lightbox-showcase-content-4',
  templateUrl: 'lightbox-showcase-content-4.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightboxShowcaseExample4ContentComponent implements OnInit {
  confirmPanel = false;

  constructor(
    private _lightBoxRef: LightboxRef<LightboxShowcaseExample4ContentComponent>,
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
  selector: 'sbb-lightbox-showcase-example-4',
  template: `
    <div class="sbbsc-block">
      <button sbbButton mode="secondary" (click)="openDialog()">
        Open with confirmation button in one Lightbox
      </button>
    </div>
  `
})
export class LightboxShowcaseExample4Component {
  constructor(public lightbox: Lightbox) {}

  openDialog() {
    const lightboxRef = this.lightbox.openLightbox(LightboxShowcaseExample4ContentComponent, {
      disableClose: true
    });

    lightboxRef.afterClosed().subscribe(result => {
      console.log(`Lightbox ${result}`);
    });
  }
}

/**
 * Lighbox Alert with confirmation button
 * opening in a new extra Lightbox
 */
@Component({
  selector: 'sbb-lightbox-showcase-content-6',
  template: `
    <header sbbLightboxHeader></header>
    <div class="sbbsc-lb-disableclose-c-2">
      <h3>
        Sind Sie sicher, dass Sie dieses Fenster schliessen möchten? Ihre Eingaben werden dadurch
        verworfen.
      </h3>
      <button sbbButton mode="ghost" (click)="closeThisLightbox()">
        Eingaben überprüfen
      </button>
      <button sbbButton (click)="closeAllLightbox()">Fenster schliessen</button>
    </div>
  `
})
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

@Component({
  selector: 'sbb-lightbox-showcase-content-5',
  template: `
    <header sbbLightboxHeader></header>
    <div class="sbbsc-lb-disableclose-c-1">
      <h3 sbbLightboxTitle>
        In order to close this lightbox you have to confirm in the confirm panel which is going to
        appear when trying to close this lightbox
      </h3>
    </div>
  `
})
export class LightboxShowcaseExample5ContentComponent implements OnInit {
  constructor(
    private _lightBoxRef: LightboxRef<LightboxShowcaseExample5ContentComponent>,
    public lightbox: Lightbox
  ) {}

  ngOnInit() {
    this._lightBoxRef.manualCloseAction.subscribe(() => {
      this.lightbox.openLightbox(LightboxShowcaseExample6ContentComponent);
    });
  }
}

/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'sbb-lightbox-showcase-example-5',
  template: `
    <div class="sbbsc-block">
      <button sbbButton mode="secondary" (click)="openDialog()">
        Open with confirmation button in separate one
      </button>
    </div>
  `
})
export class LightboxShowcaseExample5Component {
  constructor(public lightbox: Lightbox) {}

  openDialog() {
    const lightboxRef = this.lightbox.openLightbox(LightboxShowcaseExample5ContentComponent, {
      disableClose: true
    });

    lightboxRef.afterClosed().subscribe(() => {
      console.log(`Lightbox confirmed`);
    });
  }
}

@Component({
  selector: 'sbb-lightbox-showcase',
  templateUrl: 'lightbox-showcase.component.html',
  styleUrls: ['lightbox-showcase.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LightboxShowcaseComponent {}
