import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, mapTo, take } from 'rxjs/operators';

import { SbbGhettoboxConfig } from './ghettobox-config';
import type { SbbGhettoboxOutlet } from './ghettobox-outlet';
import { SbbGhettoboxRef } from './ghettobox-ref';

/** Service to add ghettoboxes to a placed sbb-ghettobox-outlet. */
@Injectable({
  providedIn: 'root',
})
export class SbbGhettoboxService {
  /** Observable you can subscribe to know if sbb-ghettobox-outlet has been loaded */
  readonly outletReady: Observable<void>;

  private _outletReady = new BehaviorSubject<boolean>(false);
  private _outletInstance?: SbbGhettoboxOutlet;

  constructor() {
    this.outletReady = this._outletReady.pipe(
      filter((r) => !!r),
      take(1),
      mapTo(undefined)
    );
  }

  /** Add a new ghettobox. */
  add(config: SbbGhettoboxConfig & { message: string }): SbbGhettoboxRef;
  add(message: string, config?: SbbGhettoboxConfig): SbbGhettoboxRef;
  add(
    messageOrConfig: string | (SbbGhettoboxConfig & { message: string }),
    config?: SbbGhettoboxConfig
  ): SbbGhettoboxRef {
    this._assertOutlet();
    if (typeof messageOrConfig === 'string') {
      return this._outletInstance!.createGhettobox(messageOrConfig, config || {});
    } else {
      const { message, ...remainingConfig } = messageOrConfig;
      return this._outletInstance!.createGhettobox(message, remainingConfig || {});
    }
  }

  /** Dismiss all ghettoboxes. */
  dismissAll() {
    this._assertOutlet();
    this._outletInstance!.dismissAll();
  }

  _register(outletInstance: SbbGhettoboxOutlet) {
    if (this._outletInstance) {
      throw new Error('Only one <sbb-ghettobox-outlet> can be used at a time!');
    }
    this._outletInstance = outletInstance;
    this._outletReady.next(true);
  }

  _unregister(outletInstance: SbbGhettoboxOutlet) {
    if (!this._outletInstance) {
      throw new Error(
        'Trying to remove a <sbb-ghettobox-outlet> that has not been registered previously!'
      );
    } else if (this._outletInstance !== outletInstance) {
      throw new Error('Trying to remove an unregistered <sbb-ghettobox-outlet>!');
    }
    this._outletInstance = undefined;
    this._outletReady.next(false);
  }

  private _assertOutlet() {
    if (!this._outletInstance) {
      throw new Error(
        'No <sbb-ghettobox-outlet> has been registered! Have you added a <sbb-ghettobox-outlet> element in your DOM?'
      );
    }
  }
}
