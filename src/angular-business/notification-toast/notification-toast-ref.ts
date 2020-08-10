import { OverlayRef } from '@angular/cdk/overlay';
import { TypeRef } from '@sbb-esta/angular-core/common-behaviors';
import { Observable, Subject } from 'rxjs';

import type { NotificationToastContainerComponent } from './notification-toast-container.component';

/** Maximum amount of milliseconds that can be passed into setTimeout. */
const MAX_TIMEOUT = Math.pow(2, 31) - 1;

/**
 * Reference to a snack bar dispatched from the snack bar service.
 */
export class SbbNotificationToastRef<T> {
  /** The instance of the component making up the content of the snack bar. */
  instance: T;

  /**
   * The instance of the component making up the content of the snack bar.
   * @docs-private
   */
  containerInstance: NotificationToastContainerComponent;

  /** Subject for notifying the user that the snack bar has been dismissed. */
  private readonly _afterDismissed = new Subject<void>();

  /** Subject for notifying the user that the snack bar has opened and appeared. */
  private readonly _afterOpened = new Subject<void>();

  /**
   * Timeout ID for the duration setTimeout call. Used to clear the timeout if the snackbar is
   * dismissed before the duration passes.
   */
  private _durationTimeoutId: any;

  constructor(
    containerInstance: TypeRef<NotificationToastContainerComponent>,
    private _overlayRef: OverlayRef
  ) {
    this.containerInstance = containerInstance;
    containerInstance._onExit.subscribe(() => this._finishDismiss());
  }

  /** Dismisses the snack bar. */
  dismiss(): void {
    if (!this._afterDismissed.closed) {
      this.containerInstance.exit();
    }
    clearTimeout(this._durationTimeoutId);
  }

  /** Dismisses the snack bar after some duration */
  _dismissAfter(duration: number): void {
    // Note that we need to cap the duration to the maximum value for setTimeout, because
    // it'll revert to 1 if somebody passes in something greater (e.g. `Infinity`). See #17234.
    this._durationTimeoutId = setTimeout(() => this.dismiss(), Math.min(duration, MAX_TIMEOUT));
  }

  /** Marks the snackbar as opened */
  _open(): void {
    if (!this._afterOpened.closed) {
      this._afterOpened.next();
      this._afterOpened.complete();
    }
  }

  /** Cleans up the DOM after closing. */
  private _finishDismiss(): void {
    this._overlayRef.dispose();

    this._afterDismissed.next(null!);
    this._afterDismissed.complete();
  }

  /** Gets an observable that is notified when the snack bar is finished closing. */
  afterDismissed(): Observable<void> {
    return this._afterDismissed.asObservable();
  }

  /** Gets an observable that is notified when the snack bar has opened and appeared. */
  afterOpened(): Observable<void> {
    return this.containerInstance._onEnter;
  }
}
