import { Injectable } from '@angular/core';
import { Ghettobox, GhettoboxRef } from './ghettobox-ref';
import { GhettoboxContainerComponent } from '../ghettobox-container/ghettobox-container.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { GhettoboxComponent } from './ghettobox.component';

@Injectable({
  providedIn: 'root',
})
export class GhettoboxService {

  containerInstance: GhettoboxContainerComponent;
  attachedGhettoboxes: GhettoboxRef[] = [];

  loadInitialGhettoboxes(initialGhettoboxes: GhettoboxRef[]) {
    this.attachedGhettoboxes.push(...initialGhettoboxes);
  }

  add(ghettobox: Ghettobox): GhettoboxRef {
    const ghettoboxComponentPortal = new ComponentPortal(GhettoboxComponent);
    const ghettoboxComponentRef = this.containerInstance.attachComponentPortal(ghettoboxComponentPortal);
    ghettoboxComponentRef.instance.ghettobox = ghettobox;
    const ghettoboxRef = new GhettoboxRef(ghettoboxComponentRef);
    this.attachedGhettoboxes.push(ghettoboxRef);

    console.log(this.attachedGhettoboxes.length);

    return ghettoboxRef;
  }

  delete() {

  }

  clear() {
    this.attachedGhettoboxes.forEach(g => g.delete());
    this.attachedGhettoboxes = [];
  }
}
