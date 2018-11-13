import { Component, Input } from '@angular/core';
import { UiComponent } from '../ui-component';
import { slideAnimation } from '../animations';


@Component({
  selector: 'sbb-source-tab-doc',
  templateUrl: './source-tab-doc.component.html',
  styleUrls: ['./source-tab-doc.component.scss'],
  animations: [
    slideAnimation
  ]
})
export class SourceTabDocComponent {

  @Input() component: UiComponent;

}
