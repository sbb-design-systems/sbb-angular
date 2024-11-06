import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbPageEvent } from '@sbb-esta/angular/pagination';
import { SbbPaginationModule } from '@sbb-esta/angular/pagination';

/**
 * @title Paginator
 * @order 10
 */
@Component({
  selector: 'sbb-paginator-example',
  templateUrl: 'paginator-example.html',
  styleUrls: ['paginator-example.css'],
  imports: [
    SbbPaginationModule,
    SbbFormFieldModule,
    SbbInputModule,
    FormsModule,
    SbbCheckboxModule,
  ],
})
export class PaginatorExample {
  length = 70;
  pageSize = 10;
  pageIndex = 5;
  disabled = false;

  pageChange(event: SbbPageEvent) {
    Promise.resolve().then(() => (this.pageIndex = event.pageIndex));
    console.log(event);
  }
}
