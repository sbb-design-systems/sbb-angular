/* Autogenerated by @sbb-esta/angular-icons schematics */
// tslint:disable
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'svg[sbbIconBicycleMedium]',
  template: `
    <svg:path
      fill="none"
      stroke="#000"
      d="M10.5 17.25a5.256 5.256 0 015.25 5.25 5.256 5.256 0 01-5.25 5.25 5.256 5.256 0 01-5.25-5.25 5.256 5.256 0 015.25-5.25m15.002 0a5.256 5.256 0 015.25 5.25 5.256 5.256 0 01-5.25 5.25 5.255 5.255 0 01-5.25-5.25 5.255 5.255 0 015.25-5.25M10.5 22.5l3-8.25h8.25l3-4.5H19.5m6.002 12.75l-3.752-8.25m-10.937-3H15"
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
    class: 'sbb-icon sbb-icon-kom sbb-icon-transport',
    focusable: 'false',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconBicycleMedium {}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-bicycle-medium',
  template: ` <svg sbbIconBicycleMedium></svg> `,
  host: {
    class: 'sbb-icon-wrapper',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconBicycleMedium {}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  declarations: [SvgIconBicycleMedium, IconBicycleMedium],
  exports: [SvgIconBicycleMedium, IconBicycleMedium],
})
export class IconBicycleMediumModule {}
