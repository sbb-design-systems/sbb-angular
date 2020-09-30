import { ComponentRef, TemplateRef } from '@angular/core';
import { SbbLinkGeneratorResult } from '@sbb-esta/angular-core/models';
import { Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { SbbGhettobox, SbbGhettoboxDeletedEvent } from './ghettobox.component';

/**
 * Describe a Ghettobox object accepted from the GhettoboxService's add method
 */
export interface SbbGhettoboxConfig {
  message: string;
  icon?: TemplateRef<any>;
  link?: SbbLinkGeneratorResult;
}

/**
 * Ghettobox Reference which expose common api to retrieve the ID, the component instance, the
 * delete method.
 * Expose and subscribe to afterDelete stream in order to dispose the component if its a
 * ComponentRef of a dynamic component attached to the cdkPortalOutlet
 */
export class SbbGhettoboxRef {
  get id(): string {
    if (this._ref instanceof ComponentRef) {
      return this._ref.instance.id;
    }
    return this._ref.id;
  }

  get componentInstance(): SbbGhettobox {
    if (this._ref instanceof ComponentRef) {
      return this._ref.instance;
    }
    return this._ref;
  }

  get afterDelete(): Subject<SbbGhettoboxDeletedEvent> {
    return this.componentInstance.afterDelete;
  }

  constructor(private _ref: ComponentRef<SbbGhettobox> | SbbGhettobox) {
    this.afterDelete
      .pipe(
        take(1),
        filter(() => this._ref instanceof ComponentRef)
      )
      .subscribe(() => this._ref.destroy());
  }

  delete(): void {
    this.componentInstance.destroy();
  }
}
