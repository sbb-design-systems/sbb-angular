import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-user-plus',
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
          d="M9.084 11.697C6.144 12.757 4.5 16.25 4.5 19.5H14m3-3.5c-.73-1.967-2.21-3.632-4.088-4.303M18.5 17v5M16 19.5h5m-10-14c1.657 0 3 1.567 3 3.5s-1.343 3.5-3 3.5S8 10.933 8 9s1.343-3.5 3-3.5z"
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
          d="M13.626 17.546c-4.41 1.59-6.876 6.829-6.876 11.704H21M25.5 24c-1.095-2.95-3.315-5.448-6.132-6.455M27.75 25.5V33M24 29.25h7.5m-15-21c2.485 0 4.5 2.35 4.5 5.25s-2.015 5.25-4.5 5.25c-2.486 0-4.5-2.35-4.5-5.25s2.014-5.25 4.5-5.25z"
        />
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconUserPlusComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconUserPlusComponent],
  exports: [IconUserPlusComponent],
})
export class IconUserPlusModule {}
