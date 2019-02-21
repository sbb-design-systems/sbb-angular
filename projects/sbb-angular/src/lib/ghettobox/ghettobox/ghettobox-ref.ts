import { LinkGeneratorResult } from '../../pagination/pagination';
import { GhettoboxComponent } from './ghettobox.component';
import { TemplateRef, ComponentRef, EmbeddedViewRef } from '@angular/core';

export interface Ghettobox {
  message: string;
  icon?: TemplateRef<any>;
  link?: LinkGeneratorResult;
}

export class GhettoboxRef {
  componentInstance: GhettoboxComponent;
  componentRef: ComponentRef<GhettoboxComponent>;

  constructor(
    componentRef?: ComponentRef<GhettoboxComponent>,
    componentInstance?: GhettoboxComponent) {

    if (componentRef) {
      this.componentRef = componentRef;
    } else if (componentInstance) {
      this.componentInstance = componentInstance;
    }

  }

  delete(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    } else if (this.componentInstance) {
      this.componentInstance.destroy();
    }
  }
}
