import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-shuttle',
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
          d="M4.5 14.5v2h3v-2m9 0v2h3v-2M17 4.5H7m12.5 5h-15m0-2h-1v1h1m12.5-6c1.706 0 2.5.794 2.5 2.5v9.5h-15V5c0-1.706.794-2.5 2.5-2.5h10zM7.5 12a.5.5 0 10-1 0 .5.5 0 001 0zm10 0a.5.5 0 10-1 0 .5.5 0 001 0zm2-3.5h1v-1h-1m-14.75 13H10m-3.356-1.852L4.75 20.5l1.896 1.842m12.604-1.851H14m3.356 1.852l1.894-1.852-1.897-1.843"
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
          d="M6.75 21.75v3h4.5v-3m13.501 0v3h4.499v-3m-3.75-15h-15m18.75 7.501H6.75m0-3h-1.5v1.5h1.5m18.75-9c2.559 0 3.75 1.19 3.75 3.75v14.25H6.75V7.5c0-2.56 1.19-3.75 3.75-3.75h15zM11.25 18a.75.75 0 10-1.5 0 .75.75 0 001.5 0zm15 0a.75.75 0 10-1.5 0 .75.75 0 001.5 0zm3-5.25h1.5v-1.5h-1.5M7.125 30.75H15m-5.034-2.778L7.125 30.75l2.844 2.763m18.906-2.777H21m5.035 2.778l2.84-2.778-2.845-2.763"
        />
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconShuttleComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconShuttleComponent],
  exports: [IconShuttleComponent],
})
export class IconShuttleModule {}
