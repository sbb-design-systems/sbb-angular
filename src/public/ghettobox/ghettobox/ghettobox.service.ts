import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { GhettoboxContainerService } from '../ghettobox-container/ghettobox-container.service';

import { Ghettobox, GhettoboxRef } from './ghettobox-ref';

/**
 * Service in charge to add/delete ghettoboxes from/to the container
 */
@Injectable({
  providedIn: 'root'
})
export class GhettoboxService {
  /**
   * Observable you can subscribe to know if sbb-ghettobox-container has been loaded
   */
  readonly containerReady: Subject<void> = this._ghettoboxContainerService.containerReady;

  /**
   * Get the List of attached ghettoboxes within a container
   */
  get attachedGhettoboxes(): GhettoboxRef[] {
    return this._ghettoboxContainerService.attachedGhettoboxes;
  }

  constructor(private _ghettoboxContainerService: GhettoboxContainerService) {}

  /**
   * Add a new ghettobox
   * @param ghettobox Ghettobox object passed by the consumer
   */
  add(ghettobox: Ghettobox): GhettoboxRef {
    this._ghettoboxContainerService.checkIfContainerIsPresent();
    const ghettoboxRef = this._ghettoboxContainerService.createGhettobox(ghettobox);
    this._ghettoboxContainerService.pushGettoboxRefIntoAttachedCollection(ghettoboxRef);

    return ghettoboxRef;
  }

  /**
   * Deletes a Ghettobox by ID
   */
  deleteById(ghettoboxId: string) {
    this._ghettoboxContainerService.deleteById(ghettoboxId);
  }

  /**
   * Deletes a Ghettobox by INDEX
   */
  deleteByIndex(index: number) {
    this._ghettoboxContainerService.deleteByIndex(index);
  }

  /**
   * Clear all ghettoboxes
   */
  clearAll() {
    this._ghettoboxContainerService.clearAll();
  }
}
