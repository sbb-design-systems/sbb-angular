import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-keyboard',
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
          d="M5 14.5h2m-2-2h1m1 0h1m0 2h1m-2 2h1m-3 0h1m10 0h1m1 0h1m-9-2h1m1 0h1m1 0h1m1 0h1m-8-2h1m1 0h1m1 0h1m1 0h1m-7 4h6m2-4h1.5V15m-15 3.5h17v-8h-17v8zm7-8v-4H15"
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
          d="M7.5 21.75h3m-3-3H9m1.5 0H12m0 3h1.5m-3 3H12m-4.5 0H9m15 0h1.5m1.5 0h1.5m-13.5-3h1.5m1.5 0h1.5m1.5 0h1.5m1.5 0h1.5m-12-3H15m1.5 0H18m1.5 0H21m1.5 0H24m-10.5 6h9m3-6h2.25v3.75m-22.5 5.25h25.5v-12H5.25v12zm10.5-12v-6h6.75"
        />
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconKeyboardComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconKeyboardComponent],
  exports: [IconKeyboardComponent],
})
export class IconKeyboardModule {}
