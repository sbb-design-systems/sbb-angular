// tslint:disable:require-property-typedef
import { Component } from '@angular/core';

import { PACKAGES } from '../shared/meta';

@Component({
  selector: 'sbb-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
  standalone: false,
})
export class IntroductionComponent {
  packages = PACKAGES;
}
