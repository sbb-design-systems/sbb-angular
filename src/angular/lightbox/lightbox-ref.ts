import { DialogRef } from '@angular/cdk/dialog';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { SbbDialogContainer, SbbDialogRef } from '@sbb-esta/angular/dialog';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SbbLightboxConfig } from './lightbox-config';

/**
 * Reference to a dialog opened via the SbbLightbox service.
 */
export class SbbLightboxRef<T, R = any> extends SbbDialogRef<T, R> {
  /**
   * Observable that emits when closing the lightbox is requested when close is disabled.
   */
  readonly closeRequest: Subject<void> = new Subject<void>();

  constructor(
    ref: DialogRef<R, T>,
    config: SbbLightboxConfig,
    containerInstance: SbbDialogContainer,
  ) {
    super(ref, config, containerInstance);

    ref.overlayRef
      .keydownEvents()
      .pipe(
        filter(
          (event) => event.keyCode === ESCAPE && !!this.disableClose && !hasModifierKey(event),
        ),
      )
      .subscribe(() => this.closeRequest.next(null!));

    ref.overlayRef.detachments().subscribe(() => {
      this.closeRequest.complete();
    });
  }

  /**
   * Not supported for lightbox.
   * @docs-private
   */
  override updatePosition(): this {
    return this;
  }

  /**
   * Not supported for lightbox.
   * @docs-private
   */
  override updateSize(): this {
    return this;
  }
}
