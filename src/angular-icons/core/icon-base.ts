import { Directive, HostBinding, Input } from '@angular/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
export interface IconDimension {
  width: string;
  height: string;
  ratio: number;
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Directive()
export abstract class IconBase {
  /**
   * Configure the size of the SVG.
   * 'grow' will allow the SVG to grow or shrink to the parent size.
   * 'fixed' will apply the default width and height of the SVG.
   * 'small' will apply 24px as width and height.
   * 'medium' will apply 36px as width and height.
   * 'large' will apply 48px as width and height.
   * Defaults to 'grow'.
   */
  @Input() size:
    | 'grow'
    | 'fixed'
    | 'small'
    | 'small-grow'
    | 'medium'
    | 'medium-grow'
    | 'large'
    | 'large-grow' = 'grow';
  /**
   * Width of the icon.
   */
  @Input()
  @HostBinding('style.width')
  get width(): string | undefined {
    return this._resolveDimension(this._inputWidth, this._dimension.width);
  }
  set width(value: string | undefined) {
    if (value === undefined) {
      this._inputWidth = undefined;
      return;
    }

    this._inputWidth = this._coerceDimensionValue(value);
    if (!this._inputHeight && !value.endsWith('%')) {
      this._inputHeight = this._resolveInput(value, (v) => v / this._dimension.ratio);
    }
  }
  /**
   * Height of the icon.
   */
  @Input()
  @HostBinding('style.height')
  get height(): string | undefined {
    return this._resolveDimension(this._inputHeight, this._dimension.height);
  }
  set height(value: string | undefined) {
    if (value === undefined) {
      this._inputHeight = undefined;
      return;
    }
    this._inputHeight = this._coerceDimensionValue(value);
    if (!this._inputWidth && !value.endsWith('%')) {
      this._inputWidth = this._resolveInput(value, (v) => v * this._dimension.ratio);
    }
  }
  /**
   * The given CSS class or classes will be applied to the SVG element.
   */
  @Input() svgClass: string = '';
  @HostBinding('style.display') get display() {
    return this._isFixed() || this._inputHeight || this._inputWidth ? 'inline-block' : undefined;
  }
  /** @docs-private */
  @HostBinding('class.sbb-icon-component') sbbIconComponent: boolean = true;
  private _inputWidth: string | undefined;
  private _inputHeight: string | undefined;

  constructor(private readonly _dimension: IconDimension) {}

  private _isFixed() {
    return !this.size.endsWith('grow');
  }

  private _resolveDimension(growSize: string | undefined, fixedSize: string) {
    if (this.size === 'fixed') {
      return fixedSize;
    } else if (this.size === 'small') {
      return '24px';
    } else if (this.size === 'medium') {
      return '36px';
    } else if (this.size === 'large') {
      return '48px';
    } else {
      return growSize;
    }
  }

  private _coerceDimensionValue(value: string) {
    return Number.isNaN(+value) ? value : `${value}px`;
  }

  private _resolveInput(input: string, operation: (value: number) => number) {
    const match = /(\d*\.\d+|\d+)(\w*)/g.exec(input);
    return match && match[1] ? `${operation(Number(match[1]))}${match[2] || 'px'}` : undefined;
  }
}
