import {
  Component,
  OnInit,
  ElementRef,
  ViewChildren,
  Input,
  QueryList,
  EventEmitter,
  Output,
  HostBinding,
  ChangeDetectorRef,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
  AfterViewChecked
} from '@angular/core';
import { PageDescriptor, LinkGeneratorResult, PageChangeEvent, Page } from '../page-descriptor.model';
import { isString } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationPageDescriptor, NavigationPageChangeEvent } from '../navigation-page-descriptor.model';

@Component({
  selector: 'sbb-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnChanges {

  @HostBinding('attr.role')
  role = 'navigation';

  @HostBinding('attr.i18n-aria-label')
  ariaLabel = 'Pagination Navigation';
  /**
   * The next page descriptor
   */
  @Input()
  hasNext: NavigationPageDescriptor;

  /**
   * The previous page descriptor
   */
  @Input()
  hasPrevious: NavigationPageDescriptor;

  /**
   * This event can be used by parent components to handle events on page change
   */
  @Output()
  pageChange: EventEmitter<NavigationPageChangeEvent> = new EventEmitter<NavigationPageChangeEvent>();

  /**
   * A custom function called everytime a new pagination item has been clicked
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


  linkNext($event) {
    this.navigateToLink(this.hasNext.link);
    $event.preventDefault();
  }

  linkBefore($event) {
    this.navigateToLink(this.hasPrevious.link);
    $event.preventDefault();
  }

  private navigateToLink(linkGeneratorResult: LinkGeneratorResult) {
    let routerLink = linkGeneratorResult.routerLink;
    if (isString(linkGeneratorResult.routerLink)) {
      routerLink = (linkGeneratorResult.routerLink as string).split('/');
    }
    return this.router.navigate(routerLink as any[], linkGeneratorResult);
  }

}
