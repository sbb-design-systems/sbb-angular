import { Component, Inject } from '@angular/core';
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
  standalone: true,
  imports: [SbbLightboxModule, SbbFormFieldModule, SbbInputModule, FormsModule, SbbButtonModule],
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
  standalone: true,
  imports: [SbbLightboxModule, SbbFormFieldModule, SbbInputModule, FormsModule, SbbButtonModule],
})
export class LightboxExampleContent {
  constructor(
    public lightboxRef: SbbLightboxRef<LightboxExampleContent>,
    @Inject(SBB_LIGHTBOX_DATA) public data: LightboxData,
  ) {}

  noThanks(): void {
    this.lightboxRef.close();
  }
}
