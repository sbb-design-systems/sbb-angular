/* Autogenerated by @sbb-esta/angular-icons schematics */
// tslint:disable
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'svg[sbbIconSaDs]',
  template: `
    <svg:g fill="#000" fill-rule="evenodd">
      <svg:path
        d="M4.9 12.8h1.3c4.042 0 5.883-2.36 5.883-6.201 0-2.18-1.701-3.361-4.222-3.361H6.9l-2 9.562zM4.56 1.038h4.202c2.92 0 6.242 1.12 6.242 5.96 0 3.24-1.641 8.002-8.683 8.002H1.62L4.56 1.038zM25.843 3.718c-.82-.42-1.881-.72-2.9-.72-1.001 0-2.341.4-2.341 1.6 0 2.241 4.76 2.1 4.76 5.981 0 3.421-2.68 4.661-5.741 4.661-1.34 0-2.72-.32-3.98-.78l.72-2.38c1.08.5 2.22.96 3.42.96 1.34 0 2.662-.68 2.662-2.18 0-2.52-4.762-2.12-4.762-5.842 0-2.94 2.52-4.22 5.2-4.22 1.222 0 2.482.16 3.622.62l-.66 2.3z"
      />
    </svg:g>
  `,
  styles: [
    `
      :host-context(.sbb-icon-fixed-size) {
        width: 27px;
        height: 16px;
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
    viewBox: '0 0 27 16',
    class: 'sbb-icon sbb-icon-fpl sbb-icon-timetable-attributes',
    focusable: 'false',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconSaDs {}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-sa-ds',
  template: ` <svg sbbIconSaDs></svg> `,
  host: {
    class: 'sbb-icon-wrapper',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSaDs {}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  declarations: [SvgIconSaDs, IconSaDs],
  exports: [SvgIconSaDs, IconSaDs],
})
export class IconSaDsModule {}
