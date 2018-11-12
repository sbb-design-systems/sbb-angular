import { Component, OnInit, Input } from '@angular/core';
import { UiComponent } from '../ui-component';

@Component({
  selector: 'sbb-source-tab-doc',
  templateUrl: './source-tab-doc.component.html',
  styleUrls: ['./source-tab-doc.component.scss']
})
export class SourceTabDocComponent {

  @Input() component: UiComponent;

}
