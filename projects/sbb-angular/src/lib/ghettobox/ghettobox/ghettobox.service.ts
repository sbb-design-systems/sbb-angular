import { Injectable } from '@angular/core';
import { Ghettobox, GhettoboxRef } from './ghettobox-ref';
import { GhettoboxContainerComponent } from '../ghettobox-container/ghettobox-container.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GhettoboxService {

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

  _clearContainer() {
    this._containerInstance = undefined;
  }

  loadInitialGhettoboxes(initialGhettoboxes: GhettoboxRef[]) {
    this._attachedGhettoboxes.push(...initialGhettoboxes);
    this.containerReady.next();
  }

  add(ghettobox: Ghettobox): GhettoboxRef {
    this._checkIfContainerIsPresent();
    const ghettoboxRef = this._containerInstance.createGhettobox(ghettobox);
    this._attachedGhettoboxes.push(ghettoboxRef);

    return ghettoboxRef;
  }

  deleteById(ghettoboxId: string) {
    this._delete(this.getGhettoboxById(ghettoboxId));
  }

  deleteByIndex(index: number) {
    this._delete(this._attachedGhettoboxes[index]);
  }

  clearAll() {
    const attachedGettoboxCopy = this._attachedGhettoboxes.slice();
    attachedGettoboxCopy.forEach(g => g.delete());
  }

  deleteFromAttachedGhettoboxesCollection(ghettoboxId: string): void {
    const index = this._attachedGhettoboxes.indexOf(this.getGhettoboxById(ghettoboxId));
    if (index !== -1) {
      this._attachedGhettoboxes.splice(index, 1);
    }
  }

  private getGhettoboxById(ghettoboxId: string): GhettoboxRef {
    return this._attachedGhettoboxes.find(g => g.id === ghettoboxId);
  }

  private _delete(ghettoboxToDelete: GhettoboxRef) {
    if (ghettoboxToDelete) {
      ghettoboxToDelete.delete();
    }
  }

  private _checkIfContainerIsPresent() {
    if (!this._containerInstance) {
      throw Error('You must have a sbb-ghettobox-container in the page in order to add one or more Ghettoboxes dynamically');
    }
  }
}
