import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-tram',
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
          d="M14 7.5h-4m.5-2v-1h3v1m2.5 13l2 3m-12 0l2-3m10.5-5h-13m13 5h-13V8A2.5 2.5 0 018 5.5h8A2.5 2.5 0 0118.5 8v10.5zm-3-2.5a.5.5 0 10-1.002.001A.5.5 0 0015.5 16zm-6 0A.5.5 0 108.498 16 .5.5 0 009.5 16z"
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
          d="M21 11.25h-6m.75-3v-1.5h4.5v1.5M24 27.75l3 4.5m-18 0l3-4.5m15.75-7.5H8.25m19.5 7.5H8.25V12A3.75 3.75 0 0112 8.25h12A3.75 3.75 0 0127.75 12v15.75zM23.25 24a.751.751 0 00-1.5 0 .75.75 0 001.5 0zm-9 0a.751.751 0 00-1.5 0 .75.75 0 001.5 0z"
        />
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconTramComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconTramComponent],
  exports: [IconTramComponent],
})
export class IconTramModule {}
