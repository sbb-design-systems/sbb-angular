import { Component,
         Input,
         HostBinding } from '@angular/core';
@Component({
  selector: 'sbb-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent {

  @Input() tabId: string;
  @Input() tabTitle: string;
  @Input() active = false;
  @Input() isCloseable = false;
  @Input() template;
  @Input() dataContext;
  @Input() badgePill?: string;

  @HostBinding('class.sbb-tab-disabled')
  @Input() disabled: boolean;

}
