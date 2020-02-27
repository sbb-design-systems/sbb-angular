import { Component } from '@angular/core';

@Component({
  selector: 'sbb-links-showcase',
  templateUrl: './links-showcase.component.html',
  styleUrls: ['./links-showcase.component.scss']
})
export class LinksShowcaseComponent {
  linkMode = 'normal';
  linkIcon = 'arrow';
  socialLinkIcon = 'facebook';
  modes = ['normal', 'form', 'stretch'];
  icons = ['arrow', 'download'];
  socials = ['facebook', 'youtube', 'xing', 'linkedin', 'pinterest', 'twitter', 'instagram'];
}
