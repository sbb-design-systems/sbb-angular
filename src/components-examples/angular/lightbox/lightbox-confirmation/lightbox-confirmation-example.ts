import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
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
  imports: [SbbLightboxModule, SbbButtonModule],
})
export class LightboxConfirmationExample {
  lightbox = inject(SbbLightbox);

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
  imports: [SbbLightboxModule, SbbButtonModule],
})
export class LightboxWithConfirmationOnClose implements OnInit {
  confirmPanel = false;

  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _lightBoxRef = inject<SbbLightboxRef<LightboxWithConfirmationOnClose>>(SbbLightboxRef);

  ngOnInit() {
    this._lightBoxRef.closeRequest.subscribe(() => {
      this.confirmPanel = true;
      this._changeDetectorRef.markForCheck();
    });
  }
}
