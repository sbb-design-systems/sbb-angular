import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-curriculum-vitae',
  // tslint:disable:max-line-length
  template: `
    <svg
      focusable="false"
      [attr.class]="'sbb-svg-icon ' + svgClass"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
    >
      <path
        fill="none"
        stroke="#000"
        d="M12.5 39.5h24v-30h-24v30zm17.97-30l-1.825-3.743L20.97 9.5h9.499zm-12.07 30l1.824 3.742 7.673-3.742H18.4zm18.1-4.196l5.296-2.582L36.5 21.865v13.439zM21.317 16.982c1.757.923 3.183 3.559 3.183 6.518h-9c0-2.962 1.428-5.597 3.188-6.519a2.028 2.028 0 01-.616-1.481c0-1.12.835-2 1.928-2 1.094 0 1.929.89 1.929 2.01 0 .59-.232 1.111-.612 1.472zm-8.817-3.35v13.772L7.073 16.278l5.427-2.646zM27 23.5h7-7zm0-4h7-7zm0-4h7-7zm-12 12h19-19zm0 4h19-19zm2 4h2-2zm3 0h2-2zm3 0h2-2z"
      />
    </svg>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconCurriculumVitaeComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconCurriculumVitaeComponent],
  exports: [IconCurriculumVitaeComponent],
})
export class IconCurriculumVitaeModule {}
