import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';
import { SbbDialogRef, _SbbDialogContainerBase } from '@sbb-esta/angular/dialog';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

// Counter for unique dialog ids.
let uniqueId = 0;

/**
 * Reference to a dialog opened via the SbbDialog service.
 */
export class SbbLightboxRef<T, R = any> extends SbbDialogRef<T, R> {
  /**
   * Observable that emits when closing the lightbox is requested when close is disabled.
   */
  readonly closeRequest: Subject<void> = new Subject<void>();

  constructor(
    overlayRef: OverlayRef,
    containerInstance: _SbbDialogContainerBase,
    /** Id of the dialog. */
    id: string = `sbb-lightbox-${uniqueId++}`
  ) {
    super(overlayRef, containerInstance, id);

    overlayRef
      .keydownEvents()
      .pipe(
        filter((event) => event.keyCode === ESCAPE && !!this.disableClose && !hasModifierKey(event))
      )
      .subscribe(() => this.closeRequest.next(null!));

    overlayRef.detachments().subscribe(() => {
      this.closeRequest.complete();
    });
  }

  /**
   * Not supported for lightbox.
   * @docs-private
   */
  updatePosition(): this {
    return this;
  }

  /** Not supported for lightbox. */
  updateSize(): this {
    return this;
  }
}
