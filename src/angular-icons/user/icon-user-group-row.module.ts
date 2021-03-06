import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-user-group-row',
  // tslint:disable:max-line-length
  template: `
    <ng-container [ngSwitch]="size">
      <svg
        *ngSwitchDefault
        focusable="false"
        [attr.class]="'sbb-svg-icon ' + svgClass"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="#000"
          d="M9.53 8.121c-.417-.386-.94-.623-1.53-.623-1.424 0-2.5 1.334-2.5 3.002 0 1.667 1.076 3 2.5 3 1.314 0 2.32-1.138 2.47-2.622m0 0c.013-.125.03-.249.03-.378 0-.978-.376-1.832-.97-2.379m.134 4.632c2.52 1.446 3.626 3.796 3.836 6.747h-11c.05-3.026 1.4-5.367 3.817-6.76m7.213-6.618c-.418-.386-.94-.623-1.53-.623-1.314 0-2.319 1.138-2.47 2.622.593.547.97 1.401.97 2.38 0 .13-.018.252-.03.377.417.386.94.623 1.53.623 1.313 0 2.32-1.138 2.47-2.623M16 3.5c-1.313 0-2.319 1.139-2.47 2.623.594.547.97 1.401.97 2.379 0 .129-.018.252-.03.377.418.386.941.623 1.53.623 1.425 0 2.5-1.333 2.5-3 0-1.668-1.075-3.002-2.5-3.002zm-1.53 5.38c.013-.126.03-.249.03-.378 0-.978-.376-1.832-.97-2.379m.136 4.63c2.52 1.446 3.624 3.797 3.834 6.748h-4.324m4.494-8.744c2.52 1.447 3.62 3.793 3.83 6.744h-4.31"
        />
      </svg>
      <svg
        *ngSwitchCase="size?.indexOf('medium') === 0 ? size : ''"
        focusable="false"
        [attr.class]="'sbb-svg-icon ' + svgClass"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 36 36"
      >
        <path
          fill="none"
          stroke="#000"
          d="M14.296 12.182c-.627-.58-1.411-.935-2.296-.935-2.136 0-3.75 2.001-3.75 4.503 0 2.5 1.614 4.5 3.75 4.5 1.97 0 3.48-1.707 3.705-3.933m0 0c.02-.187.045-.373.045-.566 0-1.467-.564-2.748-1.454-3.569m.2 6.947c3.78 2.17 5.44 5.694 5.754 10.12H3.75c.075-4.538 2.099-8.05 5.726-10.138m10.82-9.928c-.628-.579-1.412-.934-2.296-.934-1.97 0-3.478 1.707-3.705 3.933.89.82 1.455 2.101 1.455 3.568 0 .195-.027.38-.046.567.627.58 1.411.935 2.296.935 1.97 0 3.479-1.707 3.704-3.935M24 5.248c-1.97 0-3.479 1.709-3.705 3.935.891.82 1.455 2.101 1.455 3.569 0 .193-.027.377-.045.565.627.579 1.412.934 2.295.934 2.137 0 3.75-1.999 3.75-4.5S26.137 5.25 24 5.25zm-2.295 8.07c.02-.188.045-.372.045-.566 0-1.467-.564-2.748-1.454-3.568m.203 6.944c3.78 2.169 5.436 5.695 5.751 10.122h-6.486m6.74-13.116c3.78 2.17 5.43 5.69 5.746 10.116h-6.465"
        />
      </svg>
    </ng-container>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconUserGroupRowComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconUserGroupRowComponent],
  exports: [IconUserGroupRowComponent],
})
export class IconUserGroupRowModule {}
