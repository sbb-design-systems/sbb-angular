import { ComponentRef, TemplateRef } from '@angular/core';
import { LinkGeneratorResult } from '@sbb-esta/angular-core/models';
import { Subject } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { GhettoboxComponent, GhettoboxDeletedEvent } from './ghettobox.component';

/**
 * Describe a Ghettobox object accepted from the GhettoboxService's add method
 */
export interface Ghettobox {
  message: string;
  icon?: TemplateRef<any>;
  link?: LinkGeneratorResult;
}

/**
 * Ghettobox Reference which expose common api to retrieve the ID, the component instance, the
 * delete method.
 * Expose and subscribe to afterDelete stream in order to dispose the component if its a
 * ComponentRef of a dynamic component attached to the cdkPortalOutlet
 */
export class GhettoboxRef {
  get id(): string {
    if (this._ref instanceof ComponentRef) {
      return this._ref.instance.id;
    }
    return this._ref.id;
  }

  get componentInstance(): GhettoboxComponent {
    if (this._ref instanceof ComponentRef) {
      return this._ref.instance;
    }
    return this._ref;
  }

  get afterDelete(): Subject<GhettoboxDeletedEvent> {
    return this.componentInstance.afterDelete;
  }

  constructor(private _ref: ComponentRef<GhettoboxComponent> | GhettoboxComponent) {
    this.afterDelete
      .pipe(
        first(),
        filter(() => this._ref instanceof ComponentRef)
      )
      .subscribe(() => this._ref.destroy());
  }

  delete(): void {
    this.componentInstance.destroy();
  }
}
