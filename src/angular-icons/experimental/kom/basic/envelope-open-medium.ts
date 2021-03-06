/* Autogenerated by @sbb-esta/angular-icons schematics */
// tslint:disable
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'svg[sbbIconEnvelopeOpenMedium]',
  template: `
    <svg:path
      fill="none"
      stroke="#000"
      d="M15.015 24L6.75 15.75m22.5 0L21 24M6.75 32.25L18.03 21l11.22 11.25m0 0H6.75v-16.5L18 6l11.25 9.75v16.5z"
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
    class: 'sbb-icon sbb-icon-kom sbb-icon-basic',
    focusable: 'false',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconEnvelopeOpenMedium {}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-envelope-open-medium',
  template: ` <svg sbbIconEnvelopeOpenMedium></svg> `,
  host: {
    class: 'sbb-icon-wrapper',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconEnvelopeOpenMedium {}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  declarations: [SvgIconEnvelopeOpenMedium, IconEnvelopeOpenMedium],
  exports: [SvgIconEnvelopeOpenMedium, IconEnvelopeOpenMedium],
})
export class IconEnvelopeOpenMediumModule {}
