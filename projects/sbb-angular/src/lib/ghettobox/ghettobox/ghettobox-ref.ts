import { LinkGeneratorResult } from '../../pagination/pagination';
import { GhettoboxComponent } from './ghettobox.component';
import { TemplateRef, ComponentRef } from '@angular/core';

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

  private _ref: ComponentRef<GhettoboxComponent> | GhettoboxComponent;

  constructor(ref: ComponentRef<GhettoboxComponent> | GhettoboxComponent) {
    this._ref = ref;
  }

  delete(): void {
    this.componentInstance.destroy();

    if (this._ref instanceof ComponentRef) {
      this._ref.destroy();
    }
  }
}
