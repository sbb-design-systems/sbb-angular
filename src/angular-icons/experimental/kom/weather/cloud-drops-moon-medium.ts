/* Autogenerated by @sbb-esta/angular-icons schematics */
// tslint:disable
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'svg[sbbIconCloudDropsMoonMedium]',
  template: `
    <svg:path
      fill="none"
      stroke="#000"
      d="M10.8 15.3c-3.211 0-3.85 6.45 1.2 6.45h10.5c4.688 0 4.8-6.45 1.05-6.3 1.65-5.55-5.7-8.1-7.95-3-1.981-1.623-5.148-.063-4.8 2.85zm15.262 1.957c1.892.594 6.203-.444 7.688-3.756-6.252 2.643-10.434-3.531-8.277-7.8-1.633.489-2.87 1.498-3.792 4.55M9.75 24S9 25.5 9 26.25a.75.75 0 001.5 0c0-.75-.75-2.25-.75-2.25zm6 0S15 25.5 15 26.25a.75.75 0 001.5 0c0-.75-.75-2.25-.75-2.25zm6 0S21 25.5 21 26.25a.75.75 0 001.5 0c0-.75-.75-2.25-.75-2.25zm-3 3S18 28.5 18 29.25a.75.75 0 001.5 0c0-.75-.75-2.25-.75-2.25zm-6 0S12 28.5 12 29.25a.75.75 0 001.5 0c0-.75-.75-2.25-.75-2.25z"
    />
  `,
  styles: [
    `
      :host-context(.sbb-icon-fixed-size) {
        width: 36px;
        height: 36px;
      }
      :host-context(.sbb-icon-inherit-color) [fill]:not([fill='none']) {
        fill: currentColor;
      }
      :host-context(.sbb-icon-inherit-color) [stroke]:not([stroke='none']) {
        stroke: currentColor;
      }
    `,
  ],
  host: {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 36 36',
    class: 'sbb-icon sbb-icon-kom sbb-icon-weather',
    focusable: 'false',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconCloudDropsMoonMedium {}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-cloud-drops-moon-medium',
  template: ` <svg sbbIconCloudDropsMoonMedium></svg> `,
  host: {
    class: 'sbb-icon-wrapper',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconCloudDropsMoonMedium {}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  declarations: [SvgIconCloudDropsMoonMedium, IconCloudDropsMoonMedium],
  exports: [SvgIconCloudDropsMoonMedium, IconCloudDropsMoonMedium],
})
export class IconCloudDropsMoonMediumModule {}
