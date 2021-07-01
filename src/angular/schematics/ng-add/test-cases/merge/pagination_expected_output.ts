import { SbbPageEvent, SbbPaginator, SbbPaginationModule } from '@sbb-esta/angular/pagination';
import { Component, NgModule, ViewChild } from '@angular/core';

@Component({
  template: `
    <sbb-paginator (page)="changePage($event)" length="TODO: Change according to documentation. Most likely the value is the current length multiplied by the pageSize." pageSize="10"></sbb-paginator>
    <sbb-paginator length="TODO: Change according to documentation. Most likely the value is the current length multiplied by the pageSize." pageSize="10" [pageIndex]="2"></sbb-paginator>
    <sbb-paginator (page)="changePage($event)" [length]="TODO: Change according to documentation. Most likely the value is the current length multiplied by the pageSize." pageSize="10"></sbb-paginator>
    <sbb-paginator
      (page)="changePage($event)"
      [length]="TODO: Change according to documentation. Most likely the value is the current length multiplied by the pageSize." pageSize="10"
      pageIndex="0"
    ></sbb-paginator>
    <sbb-paginator
      (page)="changePage($event)"
      [pageIndex]="2"
      length="20"
      pageSize="5"
    ></sbb-paginator>
  `,
})
export class SbbPaginationTestComponent {
  @ViewChild(SbbPaginator) pagination: SbbPaginator;
  pageSize = 5;
  changePage($event: SbbPageEvent) {}
  getLength() {
    return 4;
  }
}

@NgModule({
  declarations: [SbbPaginationTestComponent],
  imports: [SbbPaginationModule],
})
export class PaginationPublicTestModule {}
