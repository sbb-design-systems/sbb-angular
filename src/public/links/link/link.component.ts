import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation
} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'a[sbbLink]',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkComponent {
  /** @docs-private */
  @HostBinding('class.sbb-link') linkClass = true;
  /**
   * Link modes available for different purposes
   */
  @Input() mode: 'normal' | 'stretch' | 'form' = 'normal';
  /**
   * Icon types available for different purposes
   */
  @Input() icon: 'arrow' | 'download' = 'arrow';

  /** @docs-private */
  @HostBinding('class.sbb-link-normal')
  get _normalClass() {
    return this.mode === 'normal';
  }

  /** @docs-private */
  @HostBinding('class.sbb-link-stretch')
  get _stretchClass() {
    return this.mode === 'stretch';
  }

  /** @docs-private */
  @HostBinding('class.sbb-link-form')
  get _formClass() {
    return this.mode === 'form';
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_mode: 'normal' | 'stretch' | 'form' | string | null | undefined;
  static ngAcceptInputType_icon: 'arrow' | 'download' | string | null | undefined;
  // tslint:enable: member-ordering
}
