import { Injectable } from '@angular/core';
import { Ghettobox, GhettoboxRef } from './ghettobox-ref';
import { GhettoboxContainerComponent } from '../ghettobox-container/ghettobox-container.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GhettoboxService {

  readonly ready = new Subject<void>();

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
    this.ready.next();
  }

  add(ghettobox: Ghettobox): GhettoboxRef {
    this._checkIfContainerIsPresent();
    const ghettoboxRef = this._containerInstance.createGhettobox(ghettobox);
    this._attachedGhettoboxes.push(ghettoboxRef);

    return ghettoboxRef;
  }

  deleteById(ghettoboxId: string): boolean {
    return this._delete(this._attachedGhettoboxes.find(g => g.id === ghettoboxId));
  }

  deleteByIndex(index: number): boolean {
    return this._delete(this._attachedGhettoboxes[index]);
  }

  clearAll() {
    const attachedGettoboxCopy = this._attachedGhettoboxes.slice();
    attachedGettoboxCopy.forEach(g => g.delete());
  }

  deleteFromAttachedGhettoboxesCollection(ghettoboxToDelete: GhettoboxRef): void {
    this._attachedGhettoboxes.splice(this._attachedGhettoboxes.indexOf(ghettoboxToDelete), 1);
  }

  private _delete(ghettoboxToDelete: GhettoboxRef): boolean {
    if (ghettoboxToDelete) {
      ghettoboxToDelete.delete();

      return true;
    }
    return false;
  }

  private _checkIfContainerIsPresent() {
    if (!this._containerInstance) {
      throw Error('You must have a sbb-ghettobox-container in the page in order to add one or more Ghettoboxes dynamically');
    }
  }
}
