import { Component, inject } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbLightbox } from '@sbb-esta/angular/lightbox';
import { SbbLightboxModule } from '@sbb-esta/angular/lightbox';

/**
 * @title Lightbox with component
 * @order 20
 */
@Component({
  selector: 'sbb-lightbox-component-example',
  templateUrl: 'lightbox-component-example.html',
  standalone: true,
  imports: [SbbLightboxModule, SbbButtonModule],
})
export class LightboxComponentExample {
  lightbox = inject(SbbLightbox);

  openDialog() {
    const lightboxRef = this.lightbox.open(LightboxComponentExampleContent);

    lightboxRef.afterClosed().subscribe((result) => {
      console.log(`Lightbox result: ${result}`);
    });
  }
}

@Component({
  selector: 'sbb-lightbox-component-example-content',
  templateUrl: 'lightbox-component-example-content.html',
  standalone: true,
  imports: [SbbLightboxModule, SbbButtonModule],
})
export class LightboxComponentExampleContent {}
