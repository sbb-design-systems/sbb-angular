import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-sa-fw',
  // tslint:disable:max-line-length
  template: `
    <svg
      focusable="false"
      [attr.class]="'sbb-svg-icon ' + svgClass"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 34 16"
    >
      <g fill="#000" fill-rule="evenodd">
        <path
          d="M4.561 1.037h7.701l-.479 2.2H6.902l-.74 3.441h4.66l-.44 2.201h-4.68L4.42 15H1.621zM13.141 1.037h2.801l.42 10.702h.04l4.64-10.702h3.761l.061 10.702h.04l4.94-10.702h2.901L26.083 15h-3.501l-.139-11.162h-.04L17.482 15h-3.461z"
        />
      </g>
    </svg>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSaFwComponent extends IconBase {
  constructor() {
    super({ width: '34px', height: '16px', ratio: 2.125 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconSaFwComponent],
  exports: [IconSaFwComponent],
})
export class IconSaFwModule {}
