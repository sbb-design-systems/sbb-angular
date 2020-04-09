import { Component } from '@angular/core';

@Component({
  selector: 'sbb-links-example',
  templateUrl: './links-example.component.html',
  styleUrls: ['./links-example.component.css']
})
export class LinksExampleComponent {
  linkMode = 'normal';
  linkIcon = 'arrow';
  socialLinkIcon = 'facebook';
  modes = ['normal', 'form', 'stretch'];
  icons = ['arrow', 'download'];
  socials = ['facebook', 'youtube', 'xing', 'linkedin', 'pinterest', 'twitter', 'instagram'];
}
