import { Component,
         Input,
         HostBinding } from '@angular/core';
@Component({
  selector: 'sbb-tab-new',
  templateUrl: './tab-new.component.html',
  styleUrls: ['./tab-new.component.scss']
})
export class TabNewComponent {

  @HostBinding('attr.id')
  @Input() id: string;

  @HostBinding('class.sbb-tab-disabled')
  @Input() disabled: boolean;

  @Input() title: string;
  @Input() active = false;
  @Input() isCloseable = false;
  @Input() template;
  @Input() dataContext;
  @Input() badgePill?: number;

}
