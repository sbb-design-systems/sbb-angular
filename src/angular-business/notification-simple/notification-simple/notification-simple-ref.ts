import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';

import { NotificationSimpleContainerComponent } from '../notification-simple-container/notification-simple-container.component';

export interface NotificationDismiss {
  dismissedByAction: boolean;
}

export class NotificationSimpleRef<T> {
  instance: T;

  containerInstance: NotificationSimpleContainerComponent;

  private readonly _afterDismissed = new Subject<NotificationDismiss>();

  private readonly _afterOpened = new Subject<void>();

  private _durationTimeoutId: number;

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

  afterDismissed(): Observable<NotificationDismiss> {
    return this._afterDismissed.asObservable();
  }

  afterOpened(): Observable<void> {
    return this.containerInstance._onEnter;
  }
}
