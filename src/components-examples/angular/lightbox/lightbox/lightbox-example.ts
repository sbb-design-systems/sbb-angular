import { Component, Inject } from '@angular/core';
import { SbbLightbox, SbbLightboxRef, SBB_LIGHTBOX_DATA } from '@sbb-esta/angular/lightbox';

export interface LightboxData {
  animal: string;
  name: string;
}

/**
 * @title Lightbox
 * @order 10
 */
@Component({
  selector: 'sbb-lightbox-example',
  templateUrl: 'lightbox-example.html',
})
export class LightboxExample {
  animal: string;
  name: string;

  constructor(public lightbox: SbbLightbox) {}

  open(): void {
    const lightboxRef = this.lightbox.open(LightboxExampleContent, {
      data: { name: this.name, animal: this.animal },
    });

    lightboxRef.afterClosed().subscribe((result) => {
      console.log('Lightbox sharing data was closed');
      this.animal = result;
    });
  }
}

@Component({
  selector: 'sbb-lightbox-example-content',
  templateUrl: 'lightbox-example-content.html',
})
export class LightboxExampleContent {
  constructor(
    public lightboxRef: SbbLightboxRef<LightboxExampleContent>,
    @Inject(SBB_LIGHTBOX_DATA) public data: LightboxData
  ) {}

  noThanks(): void {
    this.lightboxRef.close();
  }
}
