import { Injectable } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';

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

  private _outletReady = new AsyncSubject<void>();
  private _containerInstance?: SbbGhettoboxOutlet;

  constructor() {
    this.outletReady = this._outletReady.asObservable();
  }

  /**
   * Add a new ghettobox.
   * @param ghettobox Ghettobox object passed by the consumer
   */
  add(message: string, config?: SbbGhettoboxConfig): SbbGhettoboxRef {
    this._assertOutlet();
    return this._containerInstance!.createGhettobox(message, config || {});
  }

  /** Remove all ghettoboxes. */
  removeAll() {
    this._assertOutlet();
    this._containerInstance!.removeAll();
  }

  _register(containerInstance: SbbGhettoboxOutlet) {
    if (this._containerInstance) {
      throw new Error('Only one <sbb-ghettobox-outlet> can be used at a time!');
    }
    this._containerInstance = containerInstance;
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
  }

  private _assertOutlet() {
    if (!this._containerInstance) {
      throw new Error(
        'No <sbb-ghettobox-outlet> has been registered! Have you added a <sbb-ghettobox-outlet> element in your DOM?'
      );
    }
  }
}
