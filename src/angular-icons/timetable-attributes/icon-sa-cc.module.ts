import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-sa-cc',
  // tslint:disable:max-line-length
  template: `
    <svg
      focusable="false"
      [attr.class]="'sbb-svg-icon ' + svgClass"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 16"
    >
      <path fill-rule="evenodd" d="M1 7.3h14.058L20.143 1h2.741v14h-2.051v-4.9H3.052V15H1V7.3" />
    </svg>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSaCcComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '16px', ratio: 1.5 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconSaCcComponent],
  exports: [IconSaCcComponent],
})
export class IconSaCcModule {}
