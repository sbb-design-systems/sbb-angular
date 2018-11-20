import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'a[sbbSocialLink]',
  templateUrl: './social-link.component.html',
  styleUrls: ['./social-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialLinkComponent {
  /**
   * social icons available for different purposes
   */
  @Input() icon: 'facebook' | 'google-plus' | 'instagram' | 'linkedin' | 'pinterest' | 'twitter' | 'xing' | 'youtube';

}
