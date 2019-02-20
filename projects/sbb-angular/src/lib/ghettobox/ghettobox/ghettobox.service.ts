import { Injectable } from '@angular/core';
import { Ghettobox } from './ghettobox-ref';
import { GhettoboxContainerComponent } from '../ghettobox-container/ghettobox-container.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { GhettoboxComponent } from './ghettobox.component';

@Injectable({
  providedIn: 'root',
})
export class GhettoboxService {

  containerInstance: GhettoboxContainerComponent;

  add(ghettobox: Ghettobox) {
    const ghettoboxComponentPortal = new ComponentPortal(GhettoboxComponent);
    const ghettoboxRef = this.containerInstance.attachComponentPortal(ghettoboxComponentPortal);
    ghettoboxRef.instance.ghettobox = ghettobox;
  }

  delete() {

  }

  clear() {

  }
}
