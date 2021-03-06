import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-train',
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
          d="M16 17.5l2 4m-12 0l2-4m10 2H6m13 2H5m9-14h-4m8.5 5h-13M16 2.5H8m10.5 15h-13V8A2.5 2.5 0 018 5.5h8A2.5 2.5 0 0118.5 8v9.5zM10 2.5l2 3m2-3l-2 3m3.5 9.5a.5.5 0 10-1.002.001A.5.5 0 0015.5 15zm-6 0A.5.5 0 108.498 15 .5.5 0 009.5 15z"
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
          d="M24 26.25l3 6m-18 0l3-6m15 3H9m19.5 3h-21m13.5-21h-6m12.75 7.5H8.25M24 3.75H12m15.75 22.5H8.25V12A3.75 3.75 0 0112 8.25h12A3.75 3.75 0 0127.75 12v14.25zM15 3.75l3 4.5m3-4.5l-3 4.5m5.25 14.25a.751.751 0 00-1.5 0 .75.75 0 001.5 0zm-9 0a.751.751 0 00-1.5 0 .75.75 0 001.5 0z"
        />
      </svg>
      <svg
        *ngSwitchCase="size?.indexOf('large') === 0 ? size : ''"
        focusable="false"
        [attr.class]="'sbb-svg-icon ' + svgClass"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <g fill="none" fill-rule="evenodd">
          <path
            stroke="#000"
            d="M32 35.5l4 7m-24 0l4-7m20 3H12m26 4H10M17.5 30a1.5 1.5 0 10-3.001 0 1.5 1.5 0 003.001 0zm16 0a1.5 1.5 0 10-3.001 0 1.5 1.5 0 003.001 0zM28 14.5h-8m17.5 10h-27M32 5.5H16m21.5 30h-27v-19c0-2.761 2.325-5 5.192-5h16.616c2.868 0 5.192 2.239 5.192 5v19zM20 5.5l4 6m4-6l-4 6"
          />
          <path
            fill="#000"
            d="M24.722 28.001l1.444 1.5h-1.715v-1.5h-.902v1.5h-1.715l1.445-1.5h-1.083l-1.806 2 1.806 2h1.083l-1.445-1.5h1.715v1.5h.902v-1.5h1.715l-1.444 1.5h1.083l1.806-2-1.806-2z"
          />
        </g>
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconTrainComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconTrainComponent],
  exports: [IconTrainComponent],
})
export class IconTrainModule {}
