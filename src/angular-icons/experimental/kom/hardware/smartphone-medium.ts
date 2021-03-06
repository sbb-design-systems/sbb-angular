/* Autogenerated by @sbb-esta/angular-icons schematics */
// tslint:disable
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'svg[sbbIconSmartphoneMedium]',
  template: `
    <svg:path
      fill="none"
      stroke="#000"
      d="M15 8.25h6m-9.75-.002V29.25c0 .829.672 1.5 1.5 1.5h10.5c.83 0 1.5-.671 1.5-1.5v-21a1.5 1.5 0 00-1.5-1.5l-10.5-.002a1.5 1.5 0 00-1.5 1.5z"
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
    class: 'sbb-icon sbb-icon-kom sbb-icon-hardware',
    focusable: 'false',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconSmartphoneMedium {}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-smartphone-medium',
  template: ` <svg sbbIconSmartphoneMedium></svg> `,
  host: {
    class: 'sbb-icon-wrapper',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSmartphoneMedium {}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  declarations: [SvgIconSmartphoneMedium, IconSmartphoneMedium],
  exports: [SvgIconSmartphoneMedium, IconSmartphoneMedium],
})
export class IconSmartphoneMediumModule {}
