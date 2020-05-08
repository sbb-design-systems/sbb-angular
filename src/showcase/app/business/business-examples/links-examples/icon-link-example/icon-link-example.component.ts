import { Component } from '@angular/core';

@Component({
  selector: 'sbb-icon-link-example',
  templateUrl: './icon-link-example.component.html'
})
export class IconLinkExampleComponent {
  linkMode = 'normal';
  linkIcon = 'arrow';
  modes = ['normal', 'stretch'];
  icons = ['arrow', 'download'];
}
