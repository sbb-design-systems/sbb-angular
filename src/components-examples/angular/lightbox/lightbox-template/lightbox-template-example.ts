import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SbbLightbox } from '@sbb-esta/angular/lightbox';

/**
 * @title Lightbox with template
 * @order 30
 */
@Component({
  selector: 'sbb-lightbox-template-example',
  templateUrl: 'lightbox-template-example.html',
})
export class LightboxTemplateExample {
  @ViewChild('sampleLightboxTemplate', { static: true }) sampleLightboxTemplate: TemplateRef<any>;
  constructor(private _lightbox: SbbLightbox) {}

  openDialog() {
    const lightboxRef = this._lightbox.open(this.sampleLightboxTemplate);

    lightboxRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
