import { Component } from '@angular/core';
import { SbbLightbox } from '@sbb-esta/angular/lightbox';

/**
 * @title Lightbox
 * @order 20
 */
@Component({
  selector: 'sbb-lightbox-component-example',
  templateUrl: 'lightbox-component-example.html',
})
export class LightboxComponentExample {
  constructor(public lightbox: SbbLightbox) {}

  openDialog() {
    const lightboxRef = this.lightbox.open(LightboxComponentExampleContent);

    lightboxRef.afterClosed().subscribe((result) => {
      console.log(`Lightbox result: ${result}`);
    });
  }
}

/** Lightbox with content loaded from. footer button bar */
@Component({
  selector: 'sbb-lightbox-component-example-content',
  templateUrl: 'lightbox-component-example-content.html',
})
export class LightboxComponentExampleContent {
  align = 'center';
}
