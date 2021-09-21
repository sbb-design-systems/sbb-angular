import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, mapTo, take } from 'rxjs/operators';

import { SbbGhettoboxConfig } from './ghettobox-config';
import type { SbbGhettoboxOutlet } from './ghettobox-outlet';
import { SbbGhettoboxRef } from './ghettobox-ref';

/** Service in charge to add/delete ghettoboxes from/to the container */
@Injectable({
  providedIn: 'root',
})
export class SbbGhettoboxService {
  /** Observable you can subscribe to know if sbb-ghettobox-container has been loaded */
  readonly outletReady: Observable<void>;

  private _outletReady = new BehaviorSubject<boolean>(false);
  private _containerInstance?: SbbGhettoboxOutlet;

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
      return this._containerInstance!.createGhettobox(messageOrConfig, config || {});
    } else {
      const { message, ...remainingConfig } = messageOrConfig;
      return this._containerInstance!.createGhettobox(message, remainingConfig || {});
    }
  }

  /** Dismiss all ghettoboxes. */
  dismissAll() {
    this._assertOutlet();
    this._containerInstance!.dismissAll();
  }

  _register(containerInstance: SbbGhettoboxOutlet) {
    if (this._containerInstance) {
      throw new Error('Only one <sbb-ghettobox-outlet> can be used at a time!');
    }
    this._containerInstance = containerInstance;
    this._outletReady.next(true);
  }

  _unregister(containerInstance: SbbGhettoboxOutlet) {
    if (!this._containerInstance) {
      throw new Error(
        'Trying to remove a <sbb-ghettobox-outlet> that has not been registered previously!'
      );
    } else if (this._containerInstance !== containerInstance) {
      throw new Error('Trying to remove an unregistered <sbb-ghettobox-outlet>!');
    }
    this._containerInstance = undefined;
    this._outletReady.next(false);
  }

  private _assertOutlet() {
    if (!this._containerInstance) {
      throw new Error(
        'No <sbb-ghettobox-outlet> has been registered! Have you added a <sbb-ghettobox-outlet> element in your DOM?'
      );
    }
  }
}
