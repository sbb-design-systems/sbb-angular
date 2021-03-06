import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-ferris-wheel',
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
        d="M14.401 35.406a14.986 14.986 0 003.226 1.898m-8.98-11.819a14.896 14.896 0 002.947 7.113m0-18.197a14.906 14.906 0 00-2.948 7.113M21.515 8.647a14.896 14.896 0 00-7.113 2.947m18.197 0a14.906 14.906 0 00-7.113-2.948m12.867 12.869a14.9 14.9 0 00-2.947-7.113m0 18.197a14.915 14.915 0 002.947-7.113m-9.712 12.091a14.994 14.994 0 003.958-2.17M25.62 25.62a2.947 2.947 0 01-.4.33m-3.554-.092a2.982 2.982 0 01-.288-.238M16.499 40.5l6.001-17h2l5 17M25.485 8.646c.004-.049.015-.096.015-.146a2 2 0 00-4 0c0 .05.011.098.014.146m16.84 16.84c.049.002.096.014.145.014a2 2 0 000-4c-.049 0-.096.011-.146.014m-29.707 0c-.049-.002-.096-.014-.146-.014a2 2 0 000 4c.05 0 .098-.011.146-.014M35.407 14.4c.037-.032.08-.058.114-.094a2 2 0 10-2.828-2.828c-.036.036-.06.077-.094.115M11.594 32.6c-.038.032-.079.058-.115.094a2 2 0 102.828 2.828c.036-.035.062-.077.094-.114m18.198 0c.032.036.058.078.094.113a2 2 0 102.828-2.828c-.035-.036-.077-.06-.114-.094M14.4 11.594c-.032-.038-.058-.079-.094-.115a2 2 0 10-2.828 2.828c.036.036.077.062.115.094m13.627 11.55c.144-.098.277-.209.4-.33a3 3 0 10-4.242 0c.09.085.188.165.288.238M14 40.501h18.001M14.308 14.308l7.07 7.07-7.07-7.07zm11.313 7.07l7.071-7.07-7.07 7.07zM21.515 8.646a1.99 1.99 0 003.97 0m12.868 12.869a1.99 1.99 0 000 3.97m-29.707 0a1.99 1.99 0 000-3.97m23.953-9.92a1.989 1.989 0 002.808 2.806M14.4 35.406a1.99 1.99 0 00-2.807-2.808m23.812 0a1.99 1.99 0 00-2.808 2.809M11.594 14.4a1.989 1.989 0 002.807-2.807m-.093 21.098l7.07-7.07m4.243 0l7.071 7.07"
      />
    </svg>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconFerrisWheelComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconFerrisWheelComponent],
  exports: [IconFerrisWheelComponent],
})
export class IconFerrisWheelModule {}
