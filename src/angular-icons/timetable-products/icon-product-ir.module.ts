import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-product-ir',
  // tslint:disable:max-line-length
  template: `
    <svg
      focusable="false"
      [attr.class]="'sbb-svg-icon ' + svgClass"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 59 20"
    >
      <g fill="none" fill-rule="evenodd">
        <rect width="59" height="20" fill="#EB0000" rx="2" />
        <path
          fill="#FFF"
          fill-rule="nonzero"
          d="M9.388 4.2h4.042L8.429 15.8H4.37zM26.092 12.366a.922.922 0 00.843-.553L30.216 4.2H16.13l-5.001 11.6h4.025l3.786-8.69h5.973l-1.197 2.775-5.209-.019L22.71 15.8h4.582l-3.113-3.434h1.914z"
        />
      </g>
    </svg>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconProductIrComponent extends IconBase {
  constructor() {
    super({ width: '59px', height: '20px', ratio: 2.95 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconProductIrComponent],
  exports: [IconProductIrComponent],
})
export class IconProductIrModule {}
