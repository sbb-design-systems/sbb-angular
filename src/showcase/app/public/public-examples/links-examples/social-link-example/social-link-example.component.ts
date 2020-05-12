import { Component } from '@angular/core';

@Component({
  selector: 'sbb-social-link-example',
  templateUrl: './social-link-example.component.html'
})
export class SocialLinkExampleComponent {
  socialLinkIcon = 'facebook';
  socials = ['facebook', 'youtube', 'xing', 'linkedin', 'pinterest', 'twitter', 'instagram'];
}
