import { Component,
         Input,
         HostBinding } from '@angular/core';

@Component({
  selector: 'sbb-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent {

  @HostBinding('attr.id')
  @Input() id: string;
  @Input() disabled: boolean;
  @Input() label: string;
  @Input() labelId: string;
  @Input() active = false;
  @Input() isCloseable = false;
  @Input() template;
  @Input() dataContext;
  @Input() badgePill?: number;

}
