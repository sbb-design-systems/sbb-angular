import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-sa-hk',
  // tslint:disable:max-line-length
  template: `
    <svg
      focusable="false"
      [attr.class]="'sbb-svg-icon ' + svgClass"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 31 16"
    >
      <g fill="#000" fill-rule="evenodd">
        <path
          d="M4.541 1.037h2.801L6.161 6.678h5.642l1.179-5.641h2.801L12.862 15h-2.8l1.28-6.121H5.701L4.421 15H1.62zM26.262 1.038l-5.541 5.481h-.04l1.179-5.481h-2.8l-3 13.963h2.8l1.52-7.102 3.881 7.102h3.34l-4.5-7.602 7.061-6.361z"
        />
      </g>
    </svg>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSaHkComponent extends IconBase {
  constructor() {
    super({ width: '31px', height: '16px', ratio: 1.9375 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconSaHkComponent],
  exports: [IconSaHkComponent],
})
export class IconSaHkModule {}
