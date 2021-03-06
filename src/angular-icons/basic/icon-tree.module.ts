import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-tree',
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
          d="M2 21.5h20H2zm9.5 0V9v12.5zm0-5.5l3.5-4-3.5 4zm0-3L9 11l2.5 2zm8.508-1.852c.31-.472.492-1.034.492-1.64a3 3 0 00-3-3c-.382 0-.744.078-1.08.209-.381-2.383-2.43-4.21-4.92-4.21a5 5 0 00-5 5c0 .358.04.704.112 1.04-2.301.2-4.112 2.109-4.112 4.46a4.5 4.5 0 004.5 4.5h11a3.5 3.5 0 003.5-3.5 3.491 3.491 0 00-1.492-2.86z"
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
          d="M3 32.25h30H3zm14.25 0V13.5v18.75zm0-8.25l5.25-6-5.25 6zm0-4.5l-3.75-3 3.75 3zm12.762-2.778a4.463 4.463 0 00.738-2.46 4.5 4.5 0 00-4.5-4.5c-.573 0-1.116.117-1.62.313-.572-3.574-3.645-6.313-7.38-6.313a7.5 7.5 0 00-7.5 7.5c0 .535.06 1.054.168 1.558-3.452.3-6.168 3.164-6.168 6.692a6.75 6.75 0 006.75 6.75H27c2.9 0 5.25-2.35 5.25-5.25 0-1.776-.888-3.34-2.238-4.29z"
        />
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconTreeComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconTreeComponent],
  exports: [IconTreeComponent],
})
export class IconTreeModule {}
