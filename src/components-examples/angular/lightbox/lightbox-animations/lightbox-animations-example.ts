import { Component, inject } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbLightbox } from '@sbb-esta/angular/lightbox';
import { SbbLightboxModule } from '@sbb-esta/angular/lightbox';

/**
 * @title Lightbox Animations
 * @order 50
 */
@Component({
  selector: 'sbb-lightbox-animations-example',
  styleUrls: ['lightbox-animations-example.css'],
  templateUrl: 'lightbox-animations-example.html',
  imports: [SbbLightboxModule, SbbButtonModule],
})
export class LightboxAnimationsExample {
  lightbox = inject(SbbLightbox);

  openLightbox(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.lightbox.open(LightboxAnimationsExampleContent, {
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}

@Component({
  selector: 'sbb-lightbox-animations-example-content',
  template: `
    <sbb-lightbox-title>
      <span>Delete file</span>
    </sbb-lightbox-title>
    <sbb-lightbox-content>Would you like to delete train.jpeg?</sbb-lightbox-content>
    <sbb-lightbox-actions>
      <button sbb-button sbbLightboxClose>Ok</button>
      <button sbb-secondary-button sbbLightboxClose>No</button>
    </sbb-lightbox-actions>
  `,
  imports: [SbbLightboxModule, SbbButtonModule],
})
export class LightboxAnimationsExampleContent {}
