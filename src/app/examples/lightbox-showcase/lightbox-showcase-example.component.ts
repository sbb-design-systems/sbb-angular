import { Component, Inject } from '@angular/core';
import { Lightbox, LightboxRef, LIGHTBOX_DATA } from 'sbb-angular';

export interface LightboxData {
  animal: string;
  name: string;
}

@Component({
  selector: 'sbb-lightbox-showcase-example-content',
  templateUrl: 'lightbox-showcase-example-content.component.html'
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
  templateUrl: './lightbox-showcase-example.component.html'
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

