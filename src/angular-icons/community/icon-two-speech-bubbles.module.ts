import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-two-speech-bubbles',
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
          d="M3.5 5.5h12v9H8.75L6.5 16.75V14.5h-3v-9zm2.5 3h7m-7 2h6m3.5-2h5v9h-3v2.25l-2.25-2.25H9.5v-3m9.5-3h-3.5m2.5 2h-2.5"
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
          d="M5.25 8.25h18v13.5H13.125L9.75 25.125V21.75h-4.5V8.25zM9 12.75h10.5m-10.5 3h9m5.25-3h7.5v13.5h-4.5v3.375l-3.375-3.375H14.25v-4.5m14.25-4.5h-5.25m3.75 3h-3.75"
        />
      </svg>
      <svg
        *ngSwitchCase="size?.indexOf('large') === 0 ? size : ''"
        focusable="false"
        [attr.class]="'sbb-svg-icon ' + svgClass"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="none"
          stroke="#000"
          d="M6.5 9.5h24v18H17L12.5 32v-4.5h-6v-18zm4.5 5h14m-14 8h12m7.5-5h10v18h-6V40L30 35.5H18.5v-8m17.5-5h-5.5m5.5 4h-5.5m-19.5-8h15m7 12H23"
        />
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconTwoSpeechBubblesComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconTwoSpeechBubblesComponent],
  exports: [IconTwoSpeechBubblesComponent],
})
export class IconTwoSpeechBubblesModule {}
