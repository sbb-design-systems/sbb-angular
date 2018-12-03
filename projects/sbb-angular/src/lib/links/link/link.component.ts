import { Component, ChangeDetectionStrategy, Input, HostBinding, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'a[sbbLink]',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkComponent implements OnInit {
  /**
   * Link modes available for different purposes
   */
  @Input() mode: 'normal' | 'stretch' | 'form' = 'normal';
  /**
   * Icon types available for different purposes
   */
  @Input() icon: 'arrow' | 'download' = 'arrow';

  /**
   * Sets mode for all links
   */
  @Input() class = '';
  /**
   * Sets link mode on class property
   */
  @HostBinding('class') linkModeClass: string;

  ngOnInit(): void {
    this.linkModeClass =  `${this.class} sbb-link-${this.mode}`;
  }
}
