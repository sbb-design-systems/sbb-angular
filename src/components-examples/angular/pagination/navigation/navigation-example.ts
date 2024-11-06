import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbNavigationPageChangeEvent } from '@sbb-esta/angular/pagination';
import { SbbPaginationModule } from '@sbb-esta/angular/pagination';

/**
 * @title Navigation
 * @order 20
 */
@Component({
  selector: 'sbb-navigation-example',
  templateUrl: 'navigation-example.html',
  styleUrls: ['navigation-example.css'],
  imports: [SbbPaginationModule, SbbFormFieldModule, SbbInputModule, FormsModule, SbbButtonModule],
})
export class NavigationExample {
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

  pageChange(event: SbbNavigationPageChangeEvent) {
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
