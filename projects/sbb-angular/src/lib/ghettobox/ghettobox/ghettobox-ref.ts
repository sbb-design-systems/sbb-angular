import { LinkGeneratorResult } from '../../pagination/pagination';
import { GhettoboxComponent, GhettoboxDeletedEvent } from './ghettobox.component';
import { TemplateRef, ComponentRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface Ghettobox {
  message: string;
  icon?: TemplateRef<any>;
  link?: LinkGeneratorResult;
}

export class GhettoboxRef {

  get id(): string {
    if (this._ref instanceof ComponentRef) {
      return this._ref.instance.ghettoboxId;
    }
    return this._ref.ghettoboxId;
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

  private _ref: ComponentRef<GhettoboxComponent> | GhettoboxComponent;

  constructor(ref: ComponentRef<GhettoboxComponent> | GhettoboxComponent) {
    this._ref = ref;

    this.afterDelete.pipe(first()).subscribe(
      () => {
        if (this._ref instanceof ComponentRef) {
          this._ref.destroy();
        }
      }
    );
  }

  delete(): void {
    this.componentInstance.destroy();
  }
}
