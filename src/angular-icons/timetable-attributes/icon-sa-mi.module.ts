import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-sa-mi',
  // tslint:disable:max-line-length
  template: `
    <svg
      focusable="false"
      [attr.class]="'sbb-svg-icon ' + svgClass"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 16"
    >
      <path
        fill-rule="evenodd"
        d="M4.5 13.601v-4.5c-.928-.121-1.793-.464-2.344-1.01-.548-.546-.891-1.11-.985-1.676C1.056 5.848 1 5.424 1 5.122V1h8.4v4.122c0 .261-.057.686-.153 1.272-.113.588-.452 1.152-1.003 1.698-.55.545-1.413.888-2.344 1.01V13.6l3.499.001V15H1v-1.399h3.5z"
      />
    </svg>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSaMiComponent extends IconBase {
  constructor() {
    super({ width: '10px', height: '16px', ratio: 0.625 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconSaMiComponent],
  exports: [IconSaMiComponent],
})
export class IconSaMiModule {}
