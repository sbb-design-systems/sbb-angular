import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { isString } from 'util';

import { NavigationPageChangeEvent, NavigationPageDescriptor } from '../navigation-page-descriptor.model';
import { LinkGeneratorResult } from '../page-descriptor.model';

@Component({
  selector: 'sbb-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnChanges {
  /** Role of the sbb-navigation. */
  @HostBinding('attr.role')
  role = 'navigation';

  /**
   * The next page descriptor.
   */
  @Input()
  nextPage: string;
  nextLink: NavigationPageDescriptor;

  /**
   * The previous page descriptor.
   */
  @Input()
  previousPage: string;
  previousLink: NavigationPageDescriptor;

  /**
   * This event can be used by parent components to handle events on page change.
   */
  @Output()
  pageChange: EventEmitter<NavigationPageChangeEvent> = new EventEmitter<NavigationPageChangeEvent>();

  /**
   * A custom function called everytime a new pagination item has been clicked.
   */
  @Input()
  linkGenerator?: (direction: 'previous' | 'next') => LinkGeneratorResult;

  constructor(private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.nextPage && !this.previousPage) {
      throw Error('At least hasNext or hasPrevious must be defined in <sbb-navigation>');
    } else if (this.linkGenerator) {
      if (this.previousPage) {
        this.previousLink = { title: this.previousPage, link: this.linkGenerator('previous') };
      }
      if (this.nextPage) {
        this.nextLink = { title: this.nextPage, link: this.linkGenerator('next') };
      }
    }
    this._changeDetectorRef.markForCheck();
  }

}
