import { HostBinding, Input } from '@angular/core';

export abstract class IconBase {
  /**
   * The viewBox attribute that will be applied to the SVG element.
   * Defaults to the viewBox attribute value of the source SVG.
   */
  @Input() viewBox: string;
  /**
   * The preserveAspectRatio attribute that will be applied to the SVG element.
   * Defaults to the preserveAspectRatio attribute value of the source SVG.
   */
  @Input() preserveAspectRatio: string;
  /**
   * The width attribute that will be applied to the SVG element.
   * Defaults to the width attribute value of the source SVG.
   */
  @Input()
  get width() { return this.hasDimensionInputValue() ? this.inputWidth : this.defaultWidth; }
  set width(value: string) { this.inputWidth = value; }
  /**
   * The height attribute that will be applied to the SVG element.
   * Defaults to the height attribute value of the source SVG.
   */
  @Input()
  get height() { return this.hasDimensionInputValue() ? this.inputHeight : this.defaultHeight; }
  set height(value: string) { this.inputHeight = value; }
  /**
   * The given CSS class or classes will be applied to the SVG element.
   */
  @Input() svgClass: string;
  @HostBinding('class.sbb-icon-component') sbbIconComponent = true;
  private defaultWidth: string;
  private defaultHeight: string;
  private inputWidth: string;
  private inputHeight: string;

  constructor(values: Partial<IconBase> = {}) {
    this.viewBox = values.viewBox;
    this.preserveAspectRatio = values.preserveAspectRatio;
    this.defaultWidth = values.width;
    this.defaultHeight = values.height;
    this.svgClass = values.svgClass || '';
  }

  private hasDimensionInputValue() {
    return this.inputWidth !== undefined || this.inputHeight !== undefined;
  }
}
