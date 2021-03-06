import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-picture',
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
          d="M2.5 17.5h19M4 17.5L7 12l4 3.5 5-5.5 4 7.5M7 5.5a1.5 1.5 0 11.001 2.999A1.5 1.5 0 017 5.5zm-4.5 16h19v-19h-19v19z"
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
          d="M3.75 26.25h28.5M6 26.25L10.5 18l6 5.25L24 15l6 11.25m-19.5-18a2.249 2.249 0 012.25 2.25 2.249 2.249 0 01-2.25 2.25 2.249 2.249 0 01-2.25-2.25 2.249 2.249 0 012.25-2.25zm-6.75 24h28.5V3.75H3.75v28.5z"
        />
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPictureComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconPictureComponent],
  exports: [IconPictureComponent],
})
export class IconPictureModule {}
