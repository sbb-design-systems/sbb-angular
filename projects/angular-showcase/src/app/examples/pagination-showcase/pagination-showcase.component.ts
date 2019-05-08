import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  LinkGeneratorResult,
  NavigationPageDescriptor
} from '@sbb-esta/angular-public';

@Component({
  selector: 'sbb-pagination-showcase',
  templateUrl: './pagination-showcase.component.html',
  styleUrls: ['./pagination-showcase.component.scss']
})
export class PaginationShowcaseComponent {
  constructor(private _route: ActivatedRoute) {}

  maxPage = 7;
  initialPage = 5;

  pages = ['Einführung', 'Kapitel 1', 'Kapitel 2', 'Kapitel 3'].map(
    (page, index) => {
      return { title: page, index: index };
    }
  );

  hasPrevious: NavigationPageDescriptor = this.pages[1];
  hasNext: NavigationPageDescriptor = this.pages[2];

  get previousPage(): string {
    return this.hasPrevious ? this.hasPrevious.title : null;
  }
  get nextPage(): string {
    return this.hasNext ? this.hasNext.title : null;
  }

  newPage = { title: '' };

  onPageChange($event) {
    console.log($event);
  }

  linkGenerator = (page: {
    displayNumber: number;
    index: number;
  }): LinkGeneratorResult => {
    return {
      routerLink: ['.'],
      queryParams: { page: page.displayNumber },
      queryParamsHandling: 'merge',
      relativeTo: this._route
    };
  };

  onPageChangeNavigation($event) {
    if ($event === 'next') {
      this.hasPrevious = this.hasNext;
      this.hasNext = this.pages[this.hasNext.index + 1];
    } else {
      this.hasNext = this.hasPrevious;
      this.hasPrevious = this.pages[this.hasPrevious.index - 1];
    }
  }

  linkGeneratorNavigation = (
    direction: 'previous' | 'next'
  ): LinkGeneratorResult => {
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
      relativeTo: this._route
    };
  };

  addPage() {
    this.pages.push({ title: this.newPage.title, index: this.pages.length });
    this.newPage.title = '';
  }
}
