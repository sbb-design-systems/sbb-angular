import { Component, Input } from '@angular/core';

import { UiIcon } from '../../shared/ui-icon';

@Component({
  selector: 'sbb-examples-icon-doc',
  templateUrl: './examples-icon-doc.component.html',
  styleUrls: ['./examples-icon-doc.component.scss']
})
export class ExamplesIconDocComponent {
  @Input() uiIcon: UiIcon;

  getSelector(selector: string) {
    return '<' + selector + '></' + selector + '>';
  }
}
