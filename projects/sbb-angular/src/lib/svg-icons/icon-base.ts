import { HostBinding, Input } from '@angular/core';

export abstract class IconBase {
  @Input() viewBox: string;
  @Input() preserveAspectRatio: string;
  @Input() width: string;
  @Input() height: string;
  @Input() svgClass: string;
  @HostBinding('class.sbb-icon-component') sbbIconComponent = true;

  constructor(values: Partial<IconBase> = {}) {
    this.viewBox = values.viewBox;
    this.preserveAspectRatio = values.preserveAspectRatio;
    this.width = values.width;
    this.height = values.height;
    this.svgClass = values.svgClass || '';
  }
}
