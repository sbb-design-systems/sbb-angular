import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-timetable',
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
          d="M15.5 10.5c2.757 0 5 2.243 5 5 0 2.756-2.243 5-5 5s-5-2.244-5-5c0-2.757 2.243-5 5-5zM2 3.5h7-7zm9 0h4-4zm0 3h4-4zm6 0h5-5zm0-3h5-5zm-15 3h7-7zm0 3h7-7zm0 3h5-5zm0 3h5-5zm0 3h5-5zM15.5 12v3.5H19"
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
          d="M23.25 15.75c4.136 0 7.5 3.365 7.5 7.5 0 4.134-3.364 7.5-7.5 7.5s-7.5-3.366-7.5-7.5c0-4.135 3.364-7.5 7.5-7.5zM3 5.25h10.5H3zm13.5 0h6-6zm0 4.5h6-6zm9 0H33h-7.5zm0-4.5H33h-7.5zM3 9.75h10.5H3zm0 4.5h10.5H3zm0 4.5h7.5H3zm0 4.5h7.5H3zm0 4.5h7.5H3zM23.25 18v5.25h5.25"
        />
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconTimetableComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconTimetableComponent],
  exports: [IconTimetableComponent],
})
export class IconTimetableModule {}
