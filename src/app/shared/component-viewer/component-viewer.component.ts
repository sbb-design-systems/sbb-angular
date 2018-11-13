import { Component, OnInit, Input } from '@angular/core';
import { UiComponent } from '../ui-component';

@Component({
  selector: 'sbb-component-viewer',
  templateUrl: './component-viewer.component.html',
  styleUrls: ['./component-viewer.component.scss']
})
export class ComponentViewerComponent implements OnInit {

  toggleSrcVisible = false;

  @Input() component: UiComponent;

  ngOnInit() {
  }
}
