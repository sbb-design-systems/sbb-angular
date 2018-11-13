import { Component,
         Input,
         HostBinding } from '@angular/core';

let counter = 0;

@Component({
  selector: 'sbb-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent {

  generatedId = `content${counter++}-tab`;
  generatedLabelId = `content${counter++}`;

  @HostBinding('attr.id')
  @Input() id: string = this.generatedId;

  @HostBinding('attr.aria-labelledby')
  @Input() labelId: string = this.generatedLabelId;

  @HostBinding('attr.tabindex')
  tabindex = 0;

  @HostBinding('attr.role')
  role = 'tabpanel';

  @HostBinding('class')
  class = 'sbb-tabs-tabpanel';

  @Input() disabled: boolean;
  @Input() label: string;
  @Input() active = false;
  @Input() badgePill?: number;

}
