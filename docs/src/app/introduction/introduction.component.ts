// tslint:disable:require-property-typedef
import { KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PACKAGES } from '../shared/meta';

@Component({
  selector: 'sbb-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
  imports: [RouterLink, KeyValuePipe],
})
export class IntroductionComponent {
  packages = PACKAGES;
}
