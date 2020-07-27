import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';

import { NotificationSimpleContainerComponent } from '../notification-simple-container/notification-simple-container.component';

export interface NotificationDismiss {
  dismissedByAction: boolean;
}

const MAX_TIMEOUT = Math.pow(2, 31) - 1;

export class NotificationSimpleRef<T> {
  instance: T;

  containerInstance: NotificationSimpleContainerComponent;

  private readonly _afterDismissed = new Subject<NotificationDismiss>();

  private readonly _afterOpened = new Subject<void>();

  private _durationTimeoutId: any;

  private _dismissedByAction = false;

  constructor(
    containerInstance: NotificationSimpleContainerComponent,
    private _overlayRef: OverlayRef
  ) {
    this.containerInstance = containerInstance;
    containerInstance._onExit.subscribe(() => this._finishDismiss());
  }

  dismiss(dismissedByAction: boolean = false): void {
    this._dismissedByAction = dismissedByAction;
    if (!this._afterDismissed.closed) {
      this.containerInstance.exit();
      if (!this._dismissedByAction && (this.instance as any).dismiss) {
        (this.instance as any).dismiss();
      }
    }
    clearTimeout(this._durationTimeoutId);
  }

  private _finishDismiss(): void {
    this._overlayRef.dispose();

    this._afterDismissed.next({ dismissedByAction: this._dismissedByAction });
    this._afterDismissed.complete();
    this._dismissedByAction = false;
  }

  /** Dismisses the snack bar after some duration */
  dismissAfter(duration: number): void {
    // Note that we need to cap the duration to the maximum value for setTimeout, because
    // it'll revert to 1 if somebody passes in something greater (e.g. `Infinity`). See #17234.
    this._durationTimeoutId = setTimeout(() => this.dismiss(), Math.min(duration, MAX_TIMEOUT));
  }

  afterDismissed(): Observable<NotificationDismiss> {
    return this._afterDismissed.asObservable();
  }

  open(): void {
    if (!this._afterOpened.closed) {
      this._afterOpened.next();
      this._afterOpened.complete();
    }
  }

  afterOpened(): Observable<void> {
    return this.containerInstance._onEnter;
  }
}
