import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GhettoboxContainerComponent } from './ghettobox-container.component';
import { GhettoboxRef, Ghettobox } from '../ghettobox/ghettobox-ref';

@Injectable({
  providedIn: 'root'
})
export class GhettoboxContainerService {

  readonly containerReady = new Subject<void>();

  private _containerInstance: GhettoboxContainerComponent;
  private _attachedGhettoboxes: GhettoboxRef[] = [];

  get hasContainerLoaded(): boolean {
    return !!this._containerInstance;
  }

  get attachedGhettoboxes(): GhettoboxRef[] {
    return this._attachedGhettoboxes;
  }

  loadContainer(ghettoboxContainer: GhettoboxContainerComponent) {
    this._containerInstance = ghettoboxContainer;
  }

  loadInitialGhettoboxes(initialGhettoboxes: GhettoboxRef[]) {
    this._attachedGhettoboxes.push(...initialGhettoboxes);
    this.containerReady.next();
  }

  clearContainer() {
    this._containerInstance = undefined;
  }

  createGhettobox(ghettobox: Ghettobox): GhettoboxRef {
    return this._containerInstance.createGhettobox(ghettobox);
  }

  deleteById(ghettoboxId: string) {
    this._delete(this._getGhettoboxById(ghettoboxId));
  }

  deleteByIndex(index: number) {
    this._delete(this._attachedGhettoboxes[index]);
  }

  clearAll() {
    const attachedGettoboxCopy = this._attachedGhettoboxes.slice();
    attachedGettoboxCopy.forEach(g => g.delete());
  }

  pushGettoboxRefIntoAttachedCollection(ghettoboxRef: GhettoboxRef) {
    this._attachedGhettoboxes.push(ghettoboxRef);
  }

  deleteFromAttachedGhettoboxesCollection(ghettoboxId: string): void {
    const index = this._attachedGhettoboxes.indexOf(this._getGhettoboxById(ghettoboxId));
    if (index !== -1) {
      this._attachedGhettoboxes.splice(index, 1);
    }
  }

  checkIfContainerIsPresent() {
    if (!this._containerInstance) {
      throw Error('You must have a sbb-ghettobox-container in the page in order to add one or more Ghettoboxes dynamically');
    }
  }

  private _getGhettoboxById(ghettoboxId: string): GhettoboxRef {
    return this._attachedGhettoboxes.find(g => g.id === ghettoboxId);
  }

  private _delete(ghettoboxToDelete: GhettoboxRef) {
    if (ghettoboxToDelete) {
      ghettoboxToDelete.delete();
    }
  }

}
