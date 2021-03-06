import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IconBase } from '@sbb-esta/angular-icons/core';

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@Component({
  selector: 'sbb-icon-christmas-tree-shopping-bag',
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
        d="M27.788 34.3L22.5 27.5h5l-7-9h3l-5.014-6.572m-3.972 0L9.5 18.5h3l-7 9h5l-7 9h24.167M16.5 5.5l1 3h3l-2.5 2 1 3-2.5-2-2.5 2 1-3-2.5-2h3l1-3zm0 34.5v-3.5M28.5 21.492L27.788 34.3l-.288 5.192h16l-1-18h-14zm8.994 3.5l.006-7.5a2 2 0 00-4 0v7.5"
      />
    </svg>
  `,
  // tslint:enable:max-line-length
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconChristmasTreeShoppingBagComponent extends IconBase {
  constructor() {
    super({ width: '24px', height: '24px', ratio: 1 });
  }
}

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IconChristmasTreeShoppingBagComponent],
  exports: [IconChristmasTreeShoppingBagComponent],
})
export class IconChristmasTreeShoppingBagModule {}
