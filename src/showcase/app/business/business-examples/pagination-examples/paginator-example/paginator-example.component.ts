import { Component } from '@angular/core';
import { SbbPageEvent } from '@sbb-esta/angular-business/pagination';

@Component({
  selector: 'sbb-paginator-example',
  templateUrl: './paginator-example.component.html',
  styleUrls: ['./paginator-example.component.css'],
})
export class PaginatorExampleComponent {
  length = 7;
  pageIndex = 5;
  disabled = false;

  pageChange(event: SbbPageEvent) {
    Promise.resolve().then(() => (this.pageIndex = event.pageIndex));
    console.log(event);
  }
}
