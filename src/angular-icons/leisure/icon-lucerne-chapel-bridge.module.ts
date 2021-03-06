import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-lucerne-chapel-bridge',
  // tslint:disable:max-line-length
  template: `
    <svg
      focusable="false"
      [attr.class]="'sbb-svg-icon ' + svgClass"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
    >
      <path
        fill="none"
        stroke="#000"
        d="M21.5 16l-5 .5-4 2 9-12 9.006 12-4-2-5-.5H21.5zm-8 5.48l2-.996 6-.498M13.5 18v3.5l1.006 2 2-.5h5M15.5 17v3.5l1.006 2.5v6.08M21.5 16V28.758M14.505 23.5v5.709m15-7.729l-2-.996-6-.498m8-1.986v3.5l-1.005 2-2-.5h-5m6.006-6v3.5L26.5 23v5.435m2-4.935v4.804M41 32.5l-34 2 3.005-5L41 27.5m0 8l-33 2v-3m1.5 2.924V41m14.001-4.44V40m14.001-4.29V39"
      />
    </svg>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconLucerneChapelBridgeComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconLucerneChapelBridgeComponent],
  exports: [IconLucerneChapelBridgeComponent],
})
export class IconLucerneChapelBridgeModule {}
