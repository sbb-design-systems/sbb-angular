import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-two-finger-tap',
  // tslint:disable:max-line-length
  template: `
    <ng-container [ngSwitch]="size">
      <svg
        *ngSwitchDefault
        focusable="false"
        [attr.class]="'sbb-svg-icon ' + svgClass"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="#000"
          d="M11.5 12.5l-.002-5.999a1 1 0 112.003 0l-.002 6.5m2.001-.5a1 1 0 112.003 0s-.003.562-.003 3.5c0 2.936-.9 4.5-.9 4.5H9.5s-3.395-5.76-3.707-6.292c-.312-.531-.391-1.024 0-1.415a1.001 1.001 0 011.416 0l2.29 2.29H9.5v-2.583l-.002-5a1.002 1.002 0 012.003 0l-.001 5.506m1.997-1.508a1 1 0 112.003 0V13M15 8.152c.316-.472.5-1.04.5-1.652a3 3 0 00-3-3 2.98 2.98 0 00-2.241 1.024 2.982 2.982 0 00-2.265 4.619"
        />
      </svg>
      <svg
        *ngSwitchCase="size?.indexOf('medium') === 0 ? size : ''"
        focusable="false"
        [attr.class]="'sbb-svg-icon ' + svgClass"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 36 36"
      >
        <path
          fill="none"
          stroke="#000"
          d="M17.25 18.75l-.002-8.998a1.501 1.501 0 113.003 0l-.002 9.75m3.001-.75a1.501 1.501 0 113.005 0s-.005.842-.005 5.249c0 4.405-1.35 6.75-1.35 6.75H14.25s-5.092-8.639-5.56-9.437c-.468-.798-.587-1.537 0-2.124a1.502 1.502 0 012.123 0l3.435 3.437h.002V18.75l-.003-7.499a1.502 1.502 0 013.005 0l-.002 8.26m2.996-2.264a1.501 1.501 0 113.004 0V19.5m-.75-7.273c.474-.708.75-1.56.75-2.478 0-2.487-2.015-4.5-4.5-4.5a4.469 4.469 0 00-3.361 1.536c-2.315.188-4.139 2.102-4.139 4.464 0 .912.276 1.757.741 2.465"
        />
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconTwoFingerTapComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconTwoFingerTapComponent],
  exports: [IconTwoFingerTapComponent],
})
export class IconTwoFingerTapModule {}
