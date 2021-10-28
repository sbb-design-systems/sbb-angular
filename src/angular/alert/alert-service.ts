import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, mapTo, take } from 'rxjs/operators';

import { SbbAlertConfig } from './alert-config';
import type { SbbAlertOutlet } from './alert-outlet';
import { SbbAlertRef } from './alert-ref';

/** Service to add alerts to a placed sbb-alert-outlet. */
@Injectable({
  providedIn: 'root',
})
export class SbbAlertService {
  /** Observable you can subscribe to know if sbb-alert-outlet has been loaded */
  readonly outletReady: Observable<void>;

  private _outletReady = new BehaviorSubject<boolean>(false);
  private _outletInstance?: SbbAlertOutlet;

  constructor() {
    this.outletReady = this._outletReady.pipe(
      filter((r) => !!r),
      take(1),
      mapTo(undefined)
    );
  }

  /** Add a new alert. */
  add(config: SbbAlertConfig & { message: string }): SbbAlertRef;
  add(message: string, config?: SbbAlertConfig): SbbAlertRef;
  add(
    messageOrConfig: string | (SbbAlertConfig & { message: string }),
    config?: SbbAlertConfig
  ): SbbAlertRef {
    this._assertOutlet();
    if (typeof messageOrConfig === 'string') {
      return this._outletInstance!.createAlert(messageOrConfig, config || {});
    } else {
      const { message, ...remainingConfig } = messageOrConfig;
      return this._outletInstance!.createAlert(message, remainingConfig || {});
    }
  }

  /** Dismiss all alerts. */
  dismissAll() {
    this._assertOutlet();
    this._outletInstance!.dismissAll();
  }

  _register(outletInstance: SbbAlertOutlet) {
    if (this._outletInstance) {
      throw new Error('Only one <sbb-alert-outlet> can be used at a time!');
    }
    this._outletInstance = outletInstance;
    this._outletReady.next(true);
  }

  _unregister(outletInstance: SbbAlertOutlet) {
    if (!this._outletInstance) {
      throw new Error(
        'Trying to remove a <sbb-alert-outlet> that has not been registered previously!'
      );
    } else if (this._outletInstance !== outletInstance) {
      throw new Error('Trying to remove an unregistered <sbb-alert-outlet>!');
    }
    this._outletInstance = undefined;
    this._outletReady.next(false);
  }

  private _assertOutlet() {
    if (!this._outletInstance) {
      throw new Error(
        'No <sbb-alert-outlet> has been registered! Have you added a <sbb-alert-outlet> element in your DOM?'
      );
    }
  }
}
