import { Component } from '@angular/core';
import { SbbPageEvent } from '@sbb-esta/angular/pagination';

/**
 * @title Paginator
 * @order 10
 */
@Component({
  selector: 'sbb-paginator-example',
  templateUrl: './paginator-example.html',
  styleUrls: ['./paginator-example.css'],
})
export class PaginatorExample {
  length = 7;
  pageIndex = 5;
  disabled = false;

  pageChange(event: SbbPageEvent) {
    Promise.resolve().then(() => (this.pageIndex = event.pageIndex));
    console.log(event);
  }
}
