import { Component, ViewEncapsulation, Inject, ViewChild, TemplateRef } from '@angular/core';
import { Lightbox, LightboxRef, LIGHTBOX_DATA } from 'sbb-angular';
import { filter } from 'rxjs/operators';
import { ESCAPE } from '@angular/cdk/keycodes';

export interface LightboxData {
  animal: string;
  name: string;
}

@Component({
  selector: 'sbb-lightbox-showcase-content-1',
  templateUrl: 'lightbox-showcase-content-1.component.html'
})
export class LightboxShowcaseExampleContentComponent {

  constructor(
    public lightboxRef: LightboxRef<LightboxShowcaseExampleContentComponent>,
    @Inject(LIGHTBOX_DATA) public data: LightboxData) { }

  onNoClick(): void {
    this.lightboxRef.close();
  }

}

@Component({
  selector: 'sbb-lightbox-showcase-example',
  template: `
  <ol>
    <li>
      <input [(ngModel)]="name" placeholder="What's your name?">
    </li>
    <li>
      <button sbbButton mode="secondary" (click)="openLightbox()">Pick one</button>
    </li>
    <li *ngIf="animal">
      You chose: <i>{{animal}}</i>
    </li>
  </ol>`
})
export class LightboxShowcaseExampleComponent {

  animal: string;
  name: string;

  constructor(public lightbox: Lightbox) { }

  openLightbox(): void {
    const lightboxRef = this.lightbox.open(LightboxShowcaseExampleContentComponent, {
      data: { name: this.name, animal: this.animal }
    });

    lightboxRef.afterClosed().subscribe(result => {
      console.log('The lightbox was closed');
      this.animal = result;
    });
  }

}

@Component({
  selector: 'sbb-lightbox-showcase-content-2',
  templateUrl: 'lightbox-showcase-content-2.component.html',
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
      <button sbbButton mode="secondary" (click)="openDialog()">Open Lightbox from Component</button>
    </div>`,
})
export class LightboxShowcaseExample2Component {

  constructor(public lightbox: Lightbox) { }

  openDialog() {
    const lightboxRef = this.lightbox.open(LightboxShowcaseExample2ContentComponent);

    lightboxRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'sbb-lightbox-showcase-example-3',
  templateUrl: 'lightbox-showcase-content-3.component.html',
})
export class LightboxShowcaseExample3Component {
  @ViewChild('sampleLightboxTemplate') sampleLightboxTemplate: TemplateRef<any>;
  constructor(public lightbox: Lightbox) { }

  openDialog() {
    const lightboxRef = this.lightbox.open(this.sampleLightboxTemplate);

    lightboxRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'sbb-lightbox-showcase-content-4',
  template: `<header sbbLightboxHeader></header>
             <div sbbLightboxContent>
              <h2>DEFAULT CLOSE DISABLED - PRESS THE BUTTON ABOVE TO CLOSE MANUALLY</h2>
              <button sbbButton sbbLightboxClose>Close</button>
            </div>`,
})
export class LightboxShowcaseExample4ContentComponent {
  constructor(private _lightBoxRef: LightboxRef<LightboxShowcaseExample4ContentComponent>) {
    this._lightBoxRef.manualCloseAction.subscribe(() => {
      console.log('I WANT TO CLOSE MANUALLY');
    });

    this._lightBoxRef.keydownEvents()
      .pipe(filter(event => event.keyCode === ESCAPE))
      .subscribe(() => {
        console.log('I WANT TO CLOSE MANUALLY');
      });
  }

}

/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'sbb-lightbox-showcase-example-4',
  template: `
    <div class="sbbsc-block">
      <button sbbButton mode="secondary" (click)="openDialog()">Open Lightbox with default close disabled</button>
    </div>`,
})
export class LightboxShowcaseExample4Component {

  constructor(public lightbox: Lightbox) { }

  openDialog() {
    this.lightbox.open(LightboxShowcaseExample4ContentComponent, { disableClose: true });
  }
}


@Component({
  selector: 'sbb-lightbox-showcase',
  templateUrl: 'lightbox-showcase.component.html',
  styleUrls: ['lightbox-showcase.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LightboxShowcaseComponent {
}
