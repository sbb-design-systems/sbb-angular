import { Component, ViewEncapsulation, Inject, ViewChild, TemplateRef } from '@angular/core';
import { Lightbox, LightboxRef, LIGHTBOX_DATA } from 'sbb-angular';

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
    @Inject(LIGHTBOX_DATA) public data: LightboxData) {}

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
  selector: 'sbb-lightbox-showcase',
  templateUrl: 'lightbox-showcase.component.html',
  styleUrls: ['lightbox-showcase.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LightboxShowcaseComponent {
}
