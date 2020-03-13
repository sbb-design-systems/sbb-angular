import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sbb-pagination-showcase',
  templateUrl: './pagination-showcase.component.html',
  styleUrls: ['./pagination-showcase.component.css']
})
export class PaginationShowcaseComponent {
  constructor(private _route: ActivatedRoute) {}

  length = 7;
  pageIndex = 5;

  pages = ['Einführung', 'Kapitel 1', 'Kapitel 2', 'Kapitel 3'].map((page, index) => {
    return { title: page, index: index };
  });

  hasPrevious = this.pages[1];
  hasNext = this.pages[2];

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

  onPageChangeNavigation($event) {
    if ($event === 'next') {
      this.hasPrevious = this.hasNext;
      this.hasNext = this.pages[this.hasNext.index + 1];
    } else {
      this.hasNext = this.hasPrevious;
      this.hasPrevious = this.pages[this.hasPrevious.index - 1];
    }
  }

  addPage() {
    this.pages.push({ title: this.newPage.title, index: this.pages.length });
    this.newPage.title = '';
  }
}
