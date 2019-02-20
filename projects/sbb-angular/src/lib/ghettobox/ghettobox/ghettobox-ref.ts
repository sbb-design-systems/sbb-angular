import { LinkGeneratorResult } from '../../pagination/pagination';
import { GhettoboxComponent } from './ghettobox.component';
import { TemplateRef } from '@angular/core';

export interface Ghettobox {
  message: string;
  icon?: TemplateRef<any>;
  link?: LinkGeneratorResult;
}

export class GhettoboxRef {
  componentInstance: GhettoboxComponent;

  delete() {

  }
}
