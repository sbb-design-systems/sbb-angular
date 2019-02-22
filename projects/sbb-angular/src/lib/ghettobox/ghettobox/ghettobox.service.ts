import { Injectable } from '@angular/core';
import { Ghettobox, GhettoboxRef } from './ghettobox-ref';
import { GhettoboxContainerComponent } from '../ghettobox-container/ghettobox-container.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { GhettoboxComponent } from './ghettobox.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
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

  clearContainer() {
    this._containerInstance = undefined;
  }

  loadInitialGhettoboxes(initialGhettoboxes: GhettoboxComponent[]) {
    this._attachedGhettoboxes.push(...initialGhettoboxes.map(g => new GhettoboxRef(g)));
    this.ready.next();
  }

  add(ghettobox: Ghettobox | Ghettobox[]): GhettoboxRef | GhettoboxRef[] {
    let ghettoboxRef: GhettoboxRef | GhettoboxRef[];

    if (Array.isArray(ghettobox)) {
      ghettoboxRef = ghettobox.map(g => this.createGhettobox(g));
    } else {
      ghettoboxRef = this.createGhettobox(ghettobox);
    }

    return ghettoboxRef;
  }

  deleteById(ghettoboxId: string): boolean {
    let deleted = false;

    const ghettoboxToDelete = this._attachedGhettoboxes.find(g => g.id === ghettoboxId);

    if (ghettoboxToDelete) {
      this._attachedGhettoboxes.splice(this._attachedGhettoboxes.indexOf(ghettoboxToDelete), 1);
      ghettoboxToDelete.delete();
      deleted = true;
    }

    return deleted;
  }

  clear() {
    this._attachedGhettoboxes.forEach(g => g.delete());
    this._attachedGhettoboxes = [];
  }

  private createGhettobox(ghettobox: Ghettobox): GhettoboxRef {
    const ghettoboxComponentPortal = new ComponentPortal(GhettoboxComponent);
    const ghettoboxComponentRef = this._containerInstance.attachComponentPortal(ghettoboxComponentPortal);
    ghettoboxComponentRef.instance.ghettobox = ghettobox;
    const ghettoboxRef = new GhettoboxRef(ghettoboxComponentRef);
    this._attachedGhettoboxes.push(ghettoboxRef);

    return ghettoboxRef;
  }
}
