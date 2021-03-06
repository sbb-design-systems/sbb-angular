import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-money-exchange',
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
        <g fill="none" fill-rule="evenodd">
          <path
            stroke="#000"
            d="M2.5 12c.01-5.262 4.385-9.51 9.829-9.5 3.827.007 7.294 2.09 8.908 5.443.106.222.194.452.263.686M21.5 4v4.5H17m4.5 3.5c-.021 5.268-4.361 9.52-9.792 9.5-3.79-.014-7.327-2.192-8.946-5.516a4.704 4.704 0 01-.262-.686M2.5 20v-4.5H7"
          />
          <path
            fill="#000"
            d="M9.14 12.431v-.323c0-.068.003-.227.013-.478l.007-.048H8.045l.363-.835h.847c.078-.453.19-.878.335-1.273.606-1.657 1.714-2.485 3.322-2.485 1.135 0 2.166.357 3.09 1.071l-.485 1.091a21.62 21.62 0 00-.95-.599c-.548-.31-1.106-.465-1.675-.465-1.044 0-1.766.608-2.167 1.825a5.36 5.36 0 00-.212.835h4.293l-.376.835h-4.033c-.009.247-.014.434-.014.56 0 .062.003.16.007.29h3.67l-.375.834h-3.199c.082.463.218.894.41 1.294.232.472.51.81.834 1.017.337.215.741.323 1.21.323.388 0 .732-.054 1.032-.16.301-.11.815-.36 1.545-.756v1.341c-.205.116-.33.186-.377.21-.669.331-1.435.497-2.296.497-2.028 0-3.238-1.255-3.63-3.766H8.045l.363-.835h.731z"
          />
        </g>
      </svg>
      <svg
        *ngSwitchCase="size?.indexOf('medium') === 0 ? size : ''"
        focusable="false"
        [attr.class]="'sbb-svg-icon ' + svgClass"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 36 36"
      >
        <g fill="none" fill-rule="evenodd">
          <path
            stroke="#000"
            d="M3.75 18c.015-7.893 6.578-14.265 14.744-14.25 5.74.01 10.94 3.134 13.361 8.165.16.333.292.678.395 1.029m0-6.944v6.75H25.5M32.25 18c-.032 7.902-6.541 14.28-14.688 14.25-5.685-.02-10.99-3.288-13.419-8.274a7.056 7.056 0 01-.393-1.029m0 7.053v-6.75h6.75"
          />
          <path
            fill="#000"
            d="M13.709 18.647v-.484c0-.102.006-.34.02-.717l.011-.072h-1.672l.544-1.253h1.27c.118-.68.284-1.317.503-1.91.91-2.485 2.571-3.727 4.983-3.727 1.703 0 3.25.536 4.635 1.607l-.727 1.636a32.43 32.43 0 00-1.427-.898c-.82-.465-1.657-.698-2.51-.698-1.567 0-2.65.912-3.251 2.738a8.04 8.04 0 00-.318 1.252h6.44l-.565 1.253h-6.05c-.013.37-.02.65-.02.838 0 .095.004.24.01.435h5.505l-.562 1.253h-4.799a7.47 7.47 0 00.615 1.94c.348.709.765 1.216 1.251 1.526.506.323 1.112.485 1.815.485.582 0 1.098-.081 1.548-.242.452-.163 1.223-.54 2.318-1.132v2.011c-.308.174-.495.28-.566.314-1.003.498-2.152.747-3.444.747-3.042 0-4.857-1.883-5.445-5.65h-1.753l.544-1.252h1.097z"
          />
        </g>
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconMoneyExchangeComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconMoneyExchangeComponent],
  exports: [IconMoneyExchangeComponent],
})
export class IconMoneyExchangeModule {}
