import { HostBinding, Input } from '@angular/core';

/**
 * @deprecated Use `@sbb-esta/angular-icons` instead.
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
  get width() {
    return this._isFixed() ? this._dimension.width : this._inputWidth;
  }
  set width(value: string) {
    this._inputWidth = this._coerceDimensionValue(value);
    if (!this._inputHeight) {
      this._inputHeight = this._resolveInput(
        value,
        v => v / this._dimension.ratio
      );
    }
  }
  /**
   * Height of the icon.
   */
  @Input()
  @HostBinding('style.height')
  get height() {
    return this._isFixed() ? this._dimension.height : this._inputHeight;
  }
  set height(value: string) {
    this._inputHeight = this._coerceDimensionValue(value);
    if (!this._inputWidth) {
      this._inputWidth = this._resolveInput(
        value,
        v => v * this._dimension.ratio
      );
    }
  }
  /**
   * The given CSS class or classes will be applied to the SVG element.
   */
  @Input() svgClass = '';
  @HostBinding('style.display') get display() {
    return this._isFixed() || this._inputHeight || this._inputWidth
      ? 'inline-block'
      : undefined;
  }
  @HostBinding('class.sbb-icon-component') sbbIconComponent = true;
  private _inputWidth: string;
  private _inputHeight: string;

  constructor(
    private readonly _dimension: {
      width: string;
      height: string;
      ratio: number;
    }
  ) {}

  private _isFixed() {
    return this.size === 'fixed';
  }

  private _coerceDimensionValue(value: string) {
    return Number.isNaN(+value) ? value : `${value}px`;
  }

  private _resolveInput(input: string, operation: (value: number) => number) {
    const match = /(\d*\.\d+|\d+)(\w*)/g.exec(input);
    return match && match[1]
      ? `${operation(Number(match[1]))}${match[2] || 'px'}`
      : undefined;
  }
}
