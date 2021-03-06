/* Autogenerated by @sbb-esta/angular-icons schematics */
// tslint:disable
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'svg[sbbIconRailwaySwitchLarge]',
  template: `
    <svg:path
      fill="none"
      stroke="#000"
      d="M20.5 11.5V8v3.5H23h-2.5v6h3-3v4.385V17.5H13h7.5v-6H13h7.5zM10.5 8v32V8zm10 27.52V40v-4.48zM8 11.5h2.5H8zm0 6h2.5H8zm0 6h2.5H8zm0 6h2.5H8zm0 6h2.5H8zm5-12h6.206H13zm1 12h11-11zm-1-6h2.29H13zm12-18h2.646H25zm-7 18h11-11zm4-6h11-11zm4-6h11-11zm4-6h11-11zm-19.5 25L30 8m-9.5 28.5L40 8"
    />
  `,
  styles: [
    `
      :host-context(.sbb-icon-fixed-size) {
        width: 48px;
        height: 48px;
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
    viewBox: '0 0 48 48',
    class: 'sbb-icon sbb-icon-kom sbb-icon-installation',
    focusable: 'false',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconRailwaySwitchLarge {}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-railway-switch-large',
  template: ` <svg sbbIconRailwaySwitchLarge></svg> `,
  host: {
    class: 'sbb-icon-wrapper',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconRailwaySwitchLarge {}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  declarations: [SvgIconRailwaySwitchLarge, IconRailwaySwitchLarge],
  exports: [SvgIconRailwaySwitchLarge, IconRailwaySwitchLarge],
})
export class IconRailwaySwitchLargeModule {}
