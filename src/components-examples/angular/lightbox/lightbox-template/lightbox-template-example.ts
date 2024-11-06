import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbLightbox } from '@sbb-esta/angular/lightbox';
import { SbbLightboxModule } from '@sbb-esta/angular/lightbox';

/**
 * @title Lightbox with template
 * @order 30
 */
@Component({
  selector: 'sbb-lightbox-template-example',
  templateUrl: 'lightbox-template-example.html',
  imports: [SbbButtonModule, SbbLightboxModule],
})
export class LightboxTemplateExample {
  @ViewChild('sampleLightboxTemplate', { static: true }) sampleLightboxTemplate: TemplateRef<any>;
  private _lightbox = inject(SbbLightbox);

  openDialog() {
    const lightboxRef = this._lightbox.open(this.sampleLightboxTemplate);

    lightboxRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
