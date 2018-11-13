import { Component, Input } from '@angular/core';
import { UiComponent } from '../../shared/ui-component';

@Component({
  selector: 'sbb-examples-tab-doc',
  templateUrl: './examples-tab-doc.component.html',
  styleUrls: ['./examples-tab-doc.component.scss']
})
export class ExamplesTabDocComponent {

  @Input() component: UiComponent;

}
