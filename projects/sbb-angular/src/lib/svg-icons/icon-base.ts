import { HostBinding, Input } from '@angular/core';

/**
 * @deprecated Use `sbb-angular-icons` instead.
 */
export abstract class IconBase {
  /**
   * Configure the size of the SVG.
   * 'grow' will allow the SVG to grow or shrink to the parent size.
   * 'fixed' will apply the default width and height of the SVG.
   * Defaults to 'grow'.
   */
  @Input() size: 'grow' | 'fixed' = 'grow';
  /**
   * Width of the icon.
   */
  @Input()
  @HostBinding('style.width')
  get width() { return this.isFixed() ? this.dimension.width : this.inputWidth; }
  set width(value: string) {
    this.inputWidth = this.coerceDimensionValue(value);
    if (!this.inputHeight) {
      this.inputHeight = this.resolveInput(value, v => v / this.dimension.ratio);
    }
  }
  /**
   * Height of the icon.
   */
  @Input()
  @HostBinding('style.height')
  get height() { return this.isFixed() ? this.dimension.height : this.inputHeight; }
  set height(value: string) {
    this.inputHeight = this.coerceDimensionValue(value);
    if (!this.inputWidth) {
      this.inputWidth = this.resolveInput(value, v => v * this.dimension.ratio);
    }
  }
  /**
   * The given CSS class or classes will be applied to the SVG element.
   */
  @Input() svgClass = '';
  @HostBinding('style.display') get display() {
    return this.isFixed() || this.inputHeight || this.inputWidth ? 'inline-block' : undefined;
  }
  @HostBinding('class.sbb-icon-component') sbbIconComponent = true;
  private inputWidth: string;
  private inputHeight: string;

  constructor(private readonly dimension: { width: string, height: string, ratio: number }) { }

  private isFixed() {
    return this.size === 'fixed';
  }

  private coerceDimensionValue(value: string) {
    return Number.isNaN(+value) ? value : `${value}px`;
  }

  private resolveInput(input: string, operation: (value: number) => number) {
    const match = /(\d*\.\d+|\d+)(\w*)/g.exec(input);
    return match && match[1] ? `${operation(Number(match[1]))}${match[2] || 'px'}` : undefined;
  }
}
