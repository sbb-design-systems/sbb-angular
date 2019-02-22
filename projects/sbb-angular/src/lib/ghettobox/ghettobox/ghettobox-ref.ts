import { LinkGeneratorResult } from '../../pagination/pagination';
import { GhettoboxComponent } from './ghettobox.component';
import { TemplateRef, ComponentRef, EmbeddedViewRef } from '@angular/core';

export interface Ghettobox {
  message: string;
  icon?: TemplateRef<any>;
  link?: LinkGeneratorResult;
}

export class GhettoboxRef {

  get id(): string {
    if (this._ref instanceof GhettoboxComponent) {
      return this._ref.ghettoboxId;
    } else {
      return this._ref.instance.ghettoboxId;
    }
  }

  private _ref: ComponentRef<GhettoboxComponent> | GhettoboxComponent;

  constructor(ref: ComponentRef<GhettoboxComponent> | GhettoboxComponent) {
    this._ref = ref;
  }

  delete(): void {
    this._ref.destroy();
  }
}
