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
  styleUrls: ['./social-link.component.scss'],
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
}
