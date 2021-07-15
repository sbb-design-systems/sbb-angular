import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SbbLightbox, SbbLightboxRef } from '@sbb-esta/angular/lightbox';

export interface LightboxData {
  animal: string;
  name: string;
}

/**
 * @title Lightbox
 * @order 40
 */
@Component({
  selector: 'sbb-lightbox-confirmation-example',
  templateUrl: 'lightbox-confirmation-example.html',
})
export class LightboxConfirmationExample {
  constructor(public lightbox: SbbLightbox) {}

  openDialog() {
    const lightboxRef = this.lightbox.open(LightboxWithConfirmationOnClose, {
      disableClose: true,
    });

    lightboxRef.afterClosed().subscribe((result) => {
      console.log(`Lightbox ${result}`);
    });
  }
}

/**
 * Lightbox Alert with confirmation button
 * all into one Lightbox using manualCloseAction Observable
 */
@Component({
  selector: 'sbb-lightbox-with-confirmation-on-close',
  templateUrl: 'lightbox-with-confirmation-on-close.html',
  styles: [
    `
      .lightbox-content {
        text-align: center;
      }

      button + button {
        margin-left: 8px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightboxWithConfirmationOnClose implements OnInit {
  confirmPanel = false;

  constructor(
    private _lightBoxRef: SbbLightboxRef<LightboxWithConfirmationOnClose>,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._lightBoxRef.closeRequest.subscribe(() => {
      this.confirmPanel = true;
      this._changeDetectorRef.markForCheck();
    });
  }
}
