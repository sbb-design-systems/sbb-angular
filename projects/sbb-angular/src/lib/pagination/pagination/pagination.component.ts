import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { PageDescriptor } from '../page-descriptor.model';
import { PageNumberComponent } from '../page-number/page-number.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sbb-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements AfterViewInit, OnDestroy {


  @Input()
  initialPage = 1;

  @Input()
  maxPage: number;

  @Output()
  pageChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren(PageNumberComponent)
  pageComponents: QueryList<PageNumberComponent>;

  @Input()
  linkGenerator: (page: PageDescriptor) => NavigationExtras & { routerLink: string | any[] };

  private pageChangeSubscriptions: Subscription[];

  ngAfterViewInit(): void {
    this.pageChangeSubscriptions = this.pageComponents.map(page => {
      return page.pageClicked.subscribe(pageDescriptor => {
        if (pageDescriptor.index !== (this.initialPage - 1)) {
          this.pageChange.emit(pageDescriptor);
          if (this.linkGenerator) {
            this.linkGenerator(pageDescriptor);
          }
          console.log('Page changed', pageDescriptor);
        }
      });
    });
  }

  constructor() { }

  ngOnDestroy(): void {
    this.pageChangeSubscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  getPages() {
    let i = 0;
    let pages = [];
    if (this.maxPage < 6) {
      pages = new Array(this.maxPage).fill(0).map(val => val = ++i);
    } else {
      i = this.initialPage - 1;
      pages = new Array(3).fill(0).map(val => val = ++i);
    }
    return pages;

  }

  isFirstPage() {
    return this.initialPage === 1;
  }

  isLastPage() {
    return this.initialPage === this.maxPage;
  }

  displayMoreBefore() {
    return this.initialPage > 2 && this.maxPage > 5;
  }

  displayMoreAfter() {
    return this.initialPage < (this.maxPage - 1) && this.maxPage > 5 && (this.initialPage + 3 < this.maxPage);
  }

  displayFirstPage() {
    return this.maxPage > 5;
  }

  displayLastPage() {
    return this.maxPage > 5;
  }
}
