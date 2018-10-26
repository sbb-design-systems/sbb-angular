import { Component, ChangeDetectionStrategy, Input, HostBinding, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'a[sbbLink]',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkComponent implements OnInit {
  @Input() mode: 'normal' | 'stretch' | 'form' = 'normal';
  @Input() icon: 'arrow' | 'download' = 'arrow';

  @Input() class = '';
  @HostBinding('class') linkModeClass: string;

  ngOnInit(): void {
    this.linkModeClass =  `${this.class} sbb-link-${this.mode}`;
  }
}
