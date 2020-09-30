import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'a[sbbLink]',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css'],
  host: {
    class: 'sbb-link sbb-icon-fit',
    '[class.sbb-link-normal]': 'this.mode === "normal"',
    '[class.sbb-link-stretch]': 'this.mode === "stretch"',
    '[class.sbb-link-form]': 'this.mode === "form"',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbLink {
  /** @docs-private
   * @deprecated */
  linkClass = true;
  /**
   * Link modes available for different purposes
   */
  @Input() mode: 'normal' | 'stretch' | 'form' = 'normal';
  /**
   * Icon types available for different purposes
   */
  @Input() icon: 'arrow' | 'download' = 'arrow';

  /** @docs-private */
  get _initialIconVisible() {
    return this.mode !== 'stretch';
  }

  /** @docs-private
   * @deprecated */
  get _normalClass() {
    return this.mode === 'normal';
  }

  /** @docs-private
   * @deprecated */
  get _stretchClass() {
    return this.mode === 'stretch';
  }

  /** @docs-private
   * @deprecated */
  get _formClass() {
    return this.mode === 'form';
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_mode: 'normal' | 'stretch' | 'form' | string | null | undefined;
  static ngAcceptInputType_icon: 'arrow' | 'download' | string | null | undefined;
  // tslint:enable: member-ordering
}
