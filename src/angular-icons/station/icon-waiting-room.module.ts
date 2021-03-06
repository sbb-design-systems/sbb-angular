import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-waiting-room',
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
          d="M14.6 6.3L16.5 8l1.9-2.4m2.1 1.9c0 2.232-1.768 4-4 4-2.231 0-4-1.768-4-4s1.769-4 4-4c2.232 0 4 1.768 4 4zm-8 13h8v-4.99h-8v4.99zm2.501-5.99h3M6.499 6.5a1 1 0 11-2 0 1 1 0 012 0zm1 8v-5h-4v5h1v6h2v-6h1z"
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
          d="M21.9 9.45L24.75 12l2.85-3.6m3.15 2.85c0 3.348-2.652 6-6 6-3.346 0-6-2.652-6-6s2.654-6 6-6c3.348 0 6 2.652 6 6zm-12 19.5h12v-7.485h-12v7.485zm3.752-8.986h4.5M9.748 9.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm1.5 12v-7.5h-6v7.5h1.5v9h3v-9h1.5z"
        />
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconWaitingRoomComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconWaitingRoomComponent],
  exports: [IconWaitingRoomComponent],
})
export class IconWaitingRoomModule {}
