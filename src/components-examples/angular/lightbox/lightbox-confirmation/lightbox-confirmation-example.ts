import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbLightbox, SbbLightboxRef } from '@sbb-esta/angular/lightbox';
import { SbbLightboxModule } from '@sbb-esta/angular/lightbox';

/**
 * @title Lightbox with confirmation
 * @order 40
 */
@Component({
  selector: 'sbb-lightbox-confirmation-example',
  templateUrl: 'lightbox-confirmation-example.html',
  standalone: true,
  imports: [SbbLightboxModule, SbbButtonModule],
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
  standalone: true,
  imports: [SbbLightboxModule, SbbButtonModule],
})
export class LightboxWithConfirmationOnClose implements OnInit {
  confirmPanel = false;

  constructor(
    private _lightBoxRef: SbbLightboxRef<LightboxWithConfirmationOnClose>,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this._lightBoxRef.closeRequest.subscribe(() => {
      this.confirmPanel = true;
      this._changeDetectorRef.markForCheck();
    });
  }
}
