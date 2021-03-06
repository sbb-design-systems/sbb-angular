import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-product-ec',
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
          d="M8.488 15.8a.9.9 0 01-.359-.067.519.519 0 01-.291-.158l-.404-.337-2.554-2.046-.446-.382a.636.636 0 01-.248-.517.806.806 0 01.315-.63l6.81-6.856.27-.225.222-.18c.26-.144.555-.214.852-.202h12.502l-2.711 2.743h-7.932L12.767 8.74H20.7l-1.792 1.776h-7.932l-1.792 1.776h7.862l4.078 3.507H8.488zm15.257 0l-.334-.045a2.927 2.927 0 01-.538-.315l-.313-.292-2.42-2.09-.338-.27a.647.647 0 01-.18-.472.562.562 0 01.059-.281c.108-.151.231-.29.367-.416L27.31 4.2h18.057l-2.689 2.743H29.951l-5.265 5.35h14.496L35.687 15.8H23.745z"
        />
      </g>
    </svg>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconProductEcComponent extends IconBase {
  constructor() {
    super({ width: '59px', height: '20px', ratio: 2.95 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconProductEcComponent],
  exports: [IconProductEcComponent],
})
export class IconProductEcModule {}
