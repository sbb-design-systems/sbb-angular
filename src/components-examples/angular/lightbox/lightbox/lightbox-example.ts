import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import {
  SbbLightbox,
  SbbLightboxModule,
  SbbLightboxRef,
  SBB_LIGHTBOX_DATA,
} from '@sbb-esta/angular/lightbox';

export interface LightboxData {
  animal: string;
  name: string;
}

/**
 * @title Lightbox data sharing
 * @order 10
 */
@Component({
  selector: 'sbb-lightbox-example',
  templateUrl: 'lightbox-example.html',
  imports: [SbbLightboxModule, SbbFormFieldModule, SbbInputModule, FormsModule, SbbButtonModule],
})
export class LightboxExample {
  lightbox = inject(SbbLightbox);

  animal: string;
  name: string;

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
  imports: [SbbLightboxModule, SbbFormFieldModule, SbbInputModule, FormsModule, SbbButtonModule],
})
export class LightboxExampleContent {
  lightboxRef = inject<SbbLightboxRef<LightboxExampleContent>>(SbbLightboxRef);
  data = inject<LightboxData>(SBB_LIGHTBOX_DATA);

  noThanks(): void {
    this.lightboxRef.close();
  }
}
