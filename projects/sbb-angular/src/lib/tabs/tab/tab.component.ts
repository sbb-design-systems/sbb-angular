import { Component,
         Input,
         HostBinding,
         OnInit,
         ViewEncapsulation } from '@angular/core';

let counter = 0;

@Component({
  selector: 'sbb-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  get hostClasses(): string { return ['sbb-tabs-tabpanel',
    this.active ? '' : 'is-hidden',
    this.disabled ? 'is-disabled' : ''].join(' ');
  }

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
