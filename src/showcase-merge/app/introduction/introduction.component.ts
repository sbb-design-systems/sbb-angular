import { Component } from '@angular/core';

import { ShowcaseMeta, ShowcaseMetaLibrary } from '../shared/meta';

@Component({
  selector: 'sbb-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css'],
})
export class IntroductionComponent {
  get libraries(): ShowcaseMetaLibrary[] {
    return ShowcaseMeta.libraries();
  }
}
