import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-ticket-percent',
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
        <g fill="none" fill-rule="evenodd" stroke="#000">
          <path
            d="M18.5 11.5c0-1.7 1.3-3 3-3v-4h-19v14h19v-4c-1.7 0-3-1.3-3-3zM8.497 7.997A1.5 1.5 0 115.5 8a1.5 1.5 0 012.998-.002zM12.5 15a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-8 1l9-9"
          />
          <path stroke-dasharray="1 1" d="M16.5 18V5" />
        </g>
      </svg>
      <svg
        *ngSwitchCase="size?.indexOf('medium') === 0 ? size : ''"
        focusable="false"
        [attr.class]="'sbb-svg-icon ' + svgClass"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 36 36"
      >
        <g fill="none" fill-rule="evenodd" stroke="#000">
          <path
            d="M27.75 17.25c0-2.55 1.95-4.5 4.5-4.5v-6H3.75v21h28.5v-6c-2.55 0-4.5-1.95-4.5-4.5zm-15.004-5.254a2.249 2.249 0 11-4.5 0 2.25 2.25 0 114.5 0zM18.75 22.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-12 1.5l13.5-13.5"
          />
          <path stroke-dasharray="1 1" d="M24.75 27V7.5" />
        </g>
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconTicketPercentComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconTicketPercentComponent],
  exports: [IconTicketPercentComponent],
})
export class IconTicketPercentModule {}
