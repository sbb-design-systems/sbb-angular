import { Component } from '@angular/core';
import { PageEvent } from '@sbb-esta/angular-public/pagination';

@Component({
  selector: 'sbb-paginator-example',
  templateUrl: './paginator-example.component.html',
})
export class PaginatorExampleComponent {
  length = 7;
  pageIndex = 5;
  disabled = false;

  pageChange(event: PageEvent) {
    Promise.resolve().then(() => (this.pageIndex = event.pageIndex));
    console.log(event);
  }
}
