import { Component, OnInit } from '@angular/core';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import { NavigationPageDescriptor } from 'projects/sbb-angular/src/lib/pagination/navigation-page-descriptor.model';

@Component({
  selector: 'sbb-pagination-showcase',
  templateUrl: './pagination-showcase.component.html',
  styleUrls: ['./pagination-showcase.component.scss']
})
export class PaginationShowcaseComponent {

  constructor(private route: ActivatedRoute) { }

  maxPage = 7;
  initialPage = 5;

  pages = [
    'Introduction',
    'Chapter 1',
    'Chapter 2',
    'Chapter 3'
  ].map((page, index) => {
    return { title: page, index: index };
  });

  hasPrevious: NavigationPageDescriptor = this.pages[1];
  hasNext: NavigationPageDescriptor = this.pages[2];

  newPage = {title: ''};

  onPageChange($event) {
    console.log($event);
  }

  linkGenerator = (page: { displayNumber: number, index: number }): NavigationExtras & { routerLink: string | any[] } => {
    return {
      routerLink: ['.'],
      queryParams: { page: page.displayNumber },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    };
  }


  onPageChangeNavigation($event) {
    if ($event === 'next') {
      this.hasPrevious = this.hasNext;
      this.hasNext = this.pages[this.hasNext.index + 1];
    } else {
      this.hasNext = this.hasPrevious;
      this.hasPrevious = this.pages[this.hasPrevious.index - 1];
    }
  }

  linkGeneratorNavigation = (direction: 'previous' | 'next'): NavigationExtras & { routerLink: string | any[] } => {
    let index = null;
    if (direction === 'next') {
      index = this.hasNext.index;
    } else {
      index = this.hasPrevious.index;
    }

    return {
      routerLink: ['.'],
      queryParams: { page: index },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    };
  }

  addPage() {
    this.pages.push({title: this.newPage.title, index: this.pages.length});
    this.newPage.title = '';
  }
}
