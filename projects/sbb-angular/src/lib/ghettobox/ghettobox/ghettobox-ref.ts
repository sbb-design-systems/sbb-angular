import { LinkGeneratorResult } from '../../pagination/pagination';
import { GhettoboxComponent, GhettoboxDeletedEvent } from './ghettobox.component';
import { TemplateRef, ComponentRef } from '@angular/core';
import { first, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface Ghettobox {
  message: string;
  icon?: TemplateRef<any>;
  link?: LinkGeneratorResult;
}

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
    this.afterDelete.pipe(
      first(),
      filter(() => this._ref instanceof ComponentRef))
      .subscribe(() => this._ref.destroy());
  }

  delete(): void {
    this.componentInstance.destroy();
  }
}
