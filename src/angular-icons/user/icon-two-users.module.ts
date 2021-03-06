import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-two-users',
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
          d="M9.07 12.68c-2.9 1.1-4.57 4.52-4.57 7.82h13c0-3.3-1.692-6.7-4.592-7.8M11 6.5c1.657 0 3 1.567 3 3.5s-1.343 3.5-3 3.5-3-1.567-3-3.5 1.343-3.5 3-3.5zm0 0c1.657 0 3 1.567 3 3.5s-1.343 3.5-3 3.5-3-1.567-3-3.5 1.343-3.5 3-3.5zm0 0c0-1.9 1.3-3 3-3s3 1.6 3 3.5-1.3 3.5-3 3.5m3 7h3.5c0-3.3-1.731-6.655-4.631-7.755"
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
          d="M13.605 19.02C9.255 20.67 6.75 25.8 6.75 30.75h19.5c0-4.95-2.538-10.05-6.888-11.7M16.5 9.75c2.485 0 4.5 2.35 4.5 5.25 0 2.899-2.015 5.25-4.5 5.25-2.486 0-4.5-2.351-4.5-5.25 0-2.9 2.014-5.25 4.5-5.25zm0 0c2.485 0 4.5 2.35 4.5 5.25 0 2.899-2.015 5.25-4.5 5.25-2.486 0-4.5-2.351-4.5-5.25 0-2.9 2.014-5.25 4.5-5.25zm0 0c0-2.85 1.95-4.5 4.5-4.5s4.5 2.4 4.5 5.25-1.95 5.25-4.5 5.25m4.5 10.5h5.25c0-4.95-2.596-9.983-6.947-11.633"
        />
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconTwoUsersComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconTwoUsersComponent],
  exports: [IconTwoUsersComponent],
})
export class IconTwoUsersModule {}
