import { Injectable } from '@angular/core';
import { Ghettobox, GhettoboxRef } from './ghettobox-ref';
import { GhettoboxContainerService } from '../ghettobox-container/ghettobox-container.service';

@Injectable({
  providedIn: 'root'
})
export class GhettoboxService {

  readonly containerReady = this._ghettoboxContainerService.containerReady;

  get attachedGhettoboxes(): GhettoboxRef[] {
    return this._ghettoboxContainerService.attachedGhettoboxes;
  }

  constructor(private _ghettoboxContainerService: GhettoboxContainerService) {}

  add(ghettobox: Ghettobox): GhettoboxRef {
    this._ghettoboxContainerService.checkIfContainerIsPresent();
    const ghettoboxRef = this._ghettoboxContainerService.createGhettobox(ghettobox);
    this._ghettoboxContainerService.pushGettoboxRefIntoAttachedCollection(ghettoboxRef);

    return ghettoboxRef;
  }

  deleteById(ghettoboxId: string) {
    this._ghettoboxContainerService.deleteById(ghettoboxId);
  }

  deleteByIndex(index: number) {
    this._ghettoboxContainerService.deleteByIndex(index);
  }

  clearAll() {
    this._ghettoboxContainerService.clearAll();
  }

}
