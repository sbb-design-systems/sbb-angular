import { Component,
         Input,
         HostBinding,
         OnInit } from '@angular/core';

let counter = 0;

@Component({
  selector: 'sbb-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

  @HostBinding('attr.id')
  @Input() id: string;

  @HostBinding('attr.aria-labelledby')
  @Input() labelId: string;

  @HostBinding('attr.tabindex')
  @Input() tabindex = 0;

  @HostBinding('attr.role')
  role = 'tabpanel';

  @HostBinding('class')
  class = 'sbb-tabs-tabpanel';

  @Input() disabled: boolean;
  @Input() label: string;
  @Input() active = false;
  @Input() badgePill?: number;

  ngOnInit() {
    if(!this.id) {
        this.id = `content${counter++}-tab`;
    }
    if(!this.labelId) {
        this.labelId = `content${counter++}`;
    }
  }
}
