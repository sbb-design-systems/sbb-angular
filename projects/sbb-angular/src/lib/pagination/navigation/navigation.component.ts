import {
  Component,
  Input,
  EventEmitter,
  Output,
  HostBinding,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LinkGeneratorResult } from '../page-descriptor.model';
import { isString } from 'util';
import { Router } from '@angular/router';
import { NavigationPageDescriptor, NavigationPageChangeEvent } from '../navigation-page-descriptor.model';

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
  /** Aria-label of the pagination navigation. */
  @HostBinding('attr.i18n-aria-label')
  ariaLabel = 'Navigation@@navigationTitle';
  /**
   * The next page descriptor.
   */
  @Input()
  hasNext: NavigationPageDescriptor;

  /**
   * The previous page descriptor.
   */
  @Input()
  hasPrevious: NavigationPageDescriptor;

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

  constructor(private router: Router) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.hasNext && !this.hasPrevious) {
      throw Error('At least hasNext or hasPrevious must be defined in <sbb-navigation>');
    } else {

      if (this.linkGenerator) {
        if (this.hasPrevious) {
          this.hasPrevious.link = this.linkGenerator('previous');
        }
        if (this.hasNext) {
          this.hasNext.link = this.linkGenerator('next');
        }
      }
    }
  }

  private navigateToLink(linkGeneratorResult: LinkGeneratorResult) {
    let routerLink = linkGeneratorResult.routerLink;
    if (isString(linkGeneratorResult.routerLink)) {
      routerLink = (linkGeneratorResult.routerLink as string).split('/');
    }
    return this.router.navigate(routerLink as any[], linkGeneratorResult);
  }

}
