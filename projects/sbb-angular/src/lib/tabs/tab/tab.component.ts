import { Component, Input } from '@angular/core';

@Component({
  selector: 'sbb-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent {
  @Input() tabTitle: string;
  @Input() active = false;
  @Input() isCloseable = false;
  @Input() template;
  @Input() dataContext;
  @Input() badgePill?: string;
}
