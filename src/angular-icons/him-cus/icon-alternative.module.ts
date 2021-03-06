import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-alternative',
  // tslint:disable:max-line-length
  template: `
    <svg
      focusable="false"
      [attr.class]="'sbb-svg-icon ' + svgClass"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
    >
      <g fill="none" fill-rule="evenodd">
        <path
          fill="#EB0000"
          d="M0 1.994C0 .894.895 0 1.994 0h12.012C15.107 0 16 .894 16 1.994v12.012A1.996 1.996 0 0114.006 16H1.994A1.996 1.996 0 010 14.006V1.994z"
        />
        <path
          fill="#FFF"
          d="M10.391 2h-1.5v8.317H5.782l1.724-1.725-1.061-1.06-3.536 3.537 3.536 3.537 1.061-1.061-1.728-1.728h4.613z"
        />
      </g>
    </svg>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconAlternativeComponent extends IconBase {
  constructor() {
    super({ width: '16px', height: '16px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconAlternativeComponent],
  exports: [IconAlternativeComponent],
})
export class IconAlternativeModule {}
