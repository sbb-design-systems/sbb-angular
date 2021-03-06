/* Autogenerated by @sbb-esta/angular-icons schematics */
// tslint:disable
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'svg[sbbIconTwoUsersMedium]',
  template: `
    <svg:path
      fill="none"
      stroke="#000"
      d="M13.605 19.02C9.255 20.67 6.75 25.8 6.75 30.75h19.5c0-4.95-2.538-10.05-6.888-11.7M16.5 9.75c2.485 0 4.5 2.35 4.5 5.25 0 2.899-2.015 5.25-4.5 5.25-2.486 0-4.5-2.351-4.5-5.25 0-2.9 2.014-5.25 4.5-5.25zm0 0c2.485 0 4.5 2.35 4.5 5.25 0 2.899-2.015 5.25-4.5 5.25-2.486 0-4.5-2.351-4.5-5.25 0-2.9 2.014-5.25 4.5-5.25zm0 0c0-2.85 1.95-4.5 4.5-4.5s4.5 2.4 4.5 5.25-1.95 5.25-4.5 5.25m4.5 10.5h5.25c0-4.95-2.596-9.983-6.947-11.633"
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
    class: 'sbb-icon sbb-icon-kom sbb-icon-user',
    focusable: 'false',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconTwoUsersMedium {}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-two-users-medium',
  template: ` <svg sbbIconTwoUsersMedium></svg> `,
  host: {
    class: 'sbb-icon-wrapper',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconTwoUsersMedium {}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  declarations: [SvgIconTwoUsersMedium, IconTwoUsersMedium],
  exports: [SvgIconTwoUsersMedium, IconTwoUsersMedium],
})
export class IconTwoUsersMediumModule {}
