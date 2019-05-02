import { Component, Input } from '@angular/core';

import { SLIDE_ANIMATION } from '../../shared/animations';
import { UiComponent } from '../../shared/ui-component';

@Component({
  selector: 'sbb-examples-tab-doc',
  templateUrl: './examples-tab-doc.component.html',
  styleUrls: ['./examples-tab-doc.component.scss'],
  animations: [
    SLIDE_ANIMATION
  ]
})
export class ExamplesTabDocComponent {

  @Input() component: UiComponent;

}
