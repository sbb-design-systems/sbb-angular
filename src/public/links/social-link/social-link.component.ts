import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation
} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'a[sbbSocialLink]',
  templateUrl: './social-link.component.html',
  styleUrls: ['./social-link.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SocialLinkComponent {
  /** @docs-private */
  @HostBinding('class.sbb-social-link') socialLinkClass = true;
  /**
   * social icons available for different purposes
   */
  @Input() icon:
    | 'facebook'
    | 'instagram'
    | 'linkedin'
    | 'pinterest'
    | 'twitter'
    | 'xing'
    | 'youtube';

  // tslint:disable: member-ordering
  static ngAcceptInputType_icon:
    | 'facebook'
    | 'instagram'
    | 'linkedin'
    | 'pinterest'
    | 'twitter'
    | 'xing'
    | 'youtube'
    | string
    | null
    | undefined;
  // tslint:enable: member-ordering
}
