import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'a[sbbLink]',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css'],
  host: {
    class: 'sbb-link-business sbb-icon-fit',
    '[class.sbb-link-normal]': 'this.mode === "normal"',
    '[class.sbb-link-stretch]': 'this.mode === "stretch"',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbLink {
  /** Link modes available for different purposes */
  @Input() mode: 'normal' | 'stretch' = 'normal';
  /** Icon types available for different purposes */
  @Input() icon: 'arrow' | 'download' = 'arrow';

  // tslint:disable: member-ordering
  static ngAcceptInputType_mode: 'normal' | 'stretch' | string | null | undefined;
  static ngAcceptInputType_icon: 'arrow' | 'download' | string | null | undefined;
  // tslint:enable: member-ordering
}
