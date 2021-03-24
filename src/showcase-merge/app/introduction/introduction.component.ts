import { Component } from '@angular/core';

import { ShowcaseMeta } from '../shared/meta';

@Component({
  selector: 'sbb-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css'],
})
export class IntroductionComponent {
  packages = ShowcaseMeta.PACKAGES;
}
