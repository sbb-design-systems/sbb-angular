import { Component } from '@angular/core';
import { NavigationPageChangeEvent } from '@sbb-esta/angular-public/pagination';

@Component({
  selector: 'sbb-navigation-example',
  templateUrl: './navigation-example.component.html',
})
export class NavigationExampleComponent {
  constructor() {}

  pages = ['Introduction', 'Chapter 1', 'Chapter 2', 'Chapter 3'].map((page, index) => {
    return { title: page, index: index };
  });

  hasPrevious = this.pages[1];
  hasNext = this.pages[2];

  get previousPage(): string | null {
    return this.hasPrevious ? this.hasPrevious.title : null;
  }

  get nextPage(): string | null {
    return this.hasNext ? this.hasNext.title : null;
  }

  newPage = { title: '' };

  pageChange(event: NavigationPageChangeEvent) {
    if (event === 'next') {
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
