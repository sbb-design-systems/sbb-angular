import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinkGeneratorResult, NavigationPageDescriptor } from 'sbb-angular';

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

  previousPage: NavigationPageDescriptor = this.pages[1];
  nextPage: NavigationPageDescriptor = this.pages[2];

  newPage = {title: ''};

  onPageChange($event) {
    console.log($event);
  }

  linkGenerator = (page: { displayNumber: number, index: number }): LinkGeneratorResult => {
    return {
      routerLink: ['.'],
      queryParams: { page: page.displayNumber },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    };
  }


  onPageChangeNavigation($event) {
    if ($event === 'next') {
      this.previousPage = this.nextPage;
      this.nextPage = this.pages[this.nextPage.index + 1];
    } else {
      this.nextPage = this.previousPage;
      this.previousPage = this.pages[this.previousPage.index - 1];
    }
  }

  linkGeneratorNavigation = (direction: 'previous' | 'next'): LinkGeneratorResult => {
    let index = null;
    if (direction === 'next') {
      index = this.nextPage.index;
    } else {
      index = this.previousPage.index;
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
