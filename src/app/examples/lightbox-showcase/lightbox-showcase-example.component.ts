import { Component, Inject } from '@angular/core';
import { Lightbox, LightboxRef, LIGHTBOX_DATA } from 'sbb-angular';

export interface LightboxData {
  animal: string;
  name: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-overview-example-dialog',
  template: `
  <h1 sbbLightboxTitle>Hi {{data.name}}</h1>
  <div sbbLightboxContent>
    <p>What's your favorite animal?</p>
      <input [(ngModel)]="data.animal">
  </div>
  <div sbbLightboxFooter>
    <button (click)="onNoClick()">No Thanks</button>
    <button [sbbLightboxClose]="data.animal" cdkFocusInitial>Ok</button>
  </div>`
})
export class LightboxShowcaseExampleDialogComponent {

  constructor(
    public lightboxRef: LightboxRef<LightboxShowcaseExampleDialogComponent>,
    @Inject(LIGHTBOX_DATA) public data: LightboxData) {}

  onNoClick(): void {
    this.lightboxRef.close();
  }

}

@Component({
  selector: 'sbb-lightbox-showcase-example',
  templateUrl: './lightbox-showcase.component.html',
  styleUrls: ['./lightbox-showcase.component.scss']
})
export class LightboxShowcaseExampleComponent {

  animal: string;
  name: string;

  constructor(public lightbox: Lightbox) { }

  openLightbox(): void {
    const lightboxRef = this.lightbox.open(LightboxShowcaseExampleDialogComponent, {
      data: { name: this.name, animal: this.animal }
    });

    lightboxRef.afterClosed().subscribe(result => {
      console.log('The lightbox was closed');
      this.animal = result;
    });
  }

}

